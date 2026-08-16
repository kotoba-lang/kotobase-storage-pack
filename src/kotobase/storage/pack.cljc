(ns kotobase.storage.pack
  "An `IBlockStore` whose blocks live inside CARv2 packs on an object store.

  This is a decorator, not a transport. It takes any large-object store that
  implements `IRangeRead` and turns it into a block store with the
  `:packed-blocks` profile — so the same S3, R2, B2 or in-memory provider
  serves both planes and nothing new has to be deployed.

  ## Why the read path looks like this

  The cost of a read here is requests, not bytes. Production `kotobase.net`
  spends 92 % of a query in hydration, and 97 % of hydration's *sequential*
  term is the novelty cons chain: `{e, rest}`, width 1, and the next CID does
  not exist until the previous block is decoded (root ADR-2608021000). No
  amount of batching helps, because the caller genuinely cannot ask for the
  second block yet.

  Packing alone does not fix that either. A pack store that answers each
  `-get-blocks` with its own range request still pays one round trip per link
  in the chain — the blocks merely happen to be neighbours in one object.

  What fixes it is that they ARE neighbours: the first fetch takes a WINDOW
  rather than a frame, and the rest of the chain is already in hand. The
  chain stays sequential in logic and stops being sequential on the network.
  That is the entire mechanism, and it is why `window-bytes` is the parameter
  that matters and why the store reports `requests` and `bytes-fetched`
  separately — a window trades the second for the first, and a design that
  reported only one of them could hide the trade.

  Packs are immutable, so a cached window is never stale. Cache invalidation
  is not a problem this layer has.

  ## What it does not do

  It does not decide what to pack together. `-put-blocks!` seals exactly one
  pack per call, which makes write-locality the caller's decision and one
  commit's worth of blocks the natural unit (root ADR-2608160100).

  It does not own the catalog. Which pack holds a CID is a question the datom
  plane answers, because it has to join with commits and tenants; the catalog
  arrives here as two injected functions."
  (:require [ipld.car.bytes :as b]
            [ipld.car.v2 :as v2]
            [kotobase.storage.core :as storage]
            [kotobase.storage.object :as object]
            [kotobase.storage.pack-plan :as plan]
            [multiformats.core :as mf]))

(def default-options plan/default-options)

;; ── catalog port ────────────────────────────────────────────────────────────
;;
;; `lookup` : cids   -> {cid {:pack-cid s :file-offset n :frame-length n}}
;; `record!`: entries -> ignored. entries are the same maps, plus :pack-cid.
;;
;; Deliberately two plain functions. A protocol here would make every caller
;; that already has a datom connection implement a type to hand it over.

(defn memory-catalog
  "A catalog in an atom — the oracle, and enough for a single-process store."
  []
  (let [state (atom {})]
    {:lookup (fn [cids] (select-keys @state cids))
     :record! (fn [entries]
                (swap! state into (map (juxt :cid identity)) entries))
     :snapshot (fn [] @state)}))

;; ── read ────────────────────────────────────────────────────────────────────

(defn- fetch-run!
  "Bytes covering `run`, from a held window or one range request."
  [{:keys [objects stats window-bytes cache-bytes cache]} pack-cid run]
  (if-let [hit (plan/cache-hit @cache pack-cid (:run-start run) (:run-end run))]
    (do (swap! stats update :cache-hits inc)
        {:base (:start hit) :bytes (:bytes hit)})
    (let [{:keys [start end]} (plan/window-request run window-bytes)
          bytes (object/-get-object-range objects pack-cid start end)]
      (swap! stats (fn [s] (-> s
                               (update :requests inc)
                               (update :bytes-fetched + (if bytes (b/bcount bytes) 0)))))
      (when bytes
        (swap! cache plan/cache-put pack-cid start bytes cache-bytes)
        {:base start :bytes bytes}))))

(defn- read-located
  "Read every located entry, one request per coalesced run."
  [ctx located]
  (reduce
   (fn [acc [pack-cid es]]
     (reduce
      (fn [acc run]
        (if-let [{:keys [base bytes]} (fetch-run! ctx pack-cid run)]
          (merge acc (plan/frames-from-window bytes base (:wanted run)))
          acc))
      acc
      (plan/plan-runs es (:max-gap-bytes ctx))))
   {}
   (group-by :pack-cid located)))

;; ── write ───────────────────────────────────────────────────────────────────

(defn seal-pack!
  "Pack `blocks` into one CARv2, store it as one object, record the catalog.

  Returns `{:pack-cid s :size-bytes n :entries [...]}`. The pack's CID is the
  raw CIDv1 of its own bytes: it is an object like any other, and it is not a
  function of the CIDs it contains."
  [{:keys [objects catalog roots]} blocks]
  (when (seq blocks)
    (let [{:keys [bytes entries]} (v2/pack {:roots (vec roots) :blocks blocks})
          pack-cid (mf/cidv1-raw (b/as-bytes bytes))
          recorded (mapv (fn [{:keys [cid file-offset frame-length]}]
                           {:cid cid :pack-cid pack-cid
                            :file-offset file-offset :frame-length frame-length})
                         entries)]
      (object/-put-object! objects pack-cid bytes)
      ((:record! catalog) recorded)
      {:pack-cid pack-cid :size-bytes (b/bcount bytes) :entries recorded})))

;; ── the store ───────────────────────────────────────────────────────────────

(defrecord PackBlockStore [objects catalog options stats cache]
  storage/IBlockStore
  (-put-blocks! [_ blocks]
    (seal-pack! {:objects objects :catalog catalog} blocks)
    (mapv :cid blocks))
  (-get-blocks [_ cids]
    (let [located (vals ((:lookup catalog) (vec cids)))]
      (read-located (assoc options
                           :objects objects :stats stats :cache cache)
                    located)))

  storage/IBackendCapabilities
  (-capabilities [_]
    #{:immutable-blocks :cid-addressed-read :packed-blocks :range-read}))

(defn pack-block-store
  "Compose an object store and a catalog into a packed block store."
  ([objects catalog] (pack-block-store objects catalog {}))
  ([objects catalog options]
   (when-not (object/range-read? objects)
     (throw (ex-info "A packed block store needs an object store with :range-read"
                     {:type :kotobase.storage.pack/no-range-read
                      :declared (object/-object-capabilities objects)})))
   (->PackBlockStore objects catalog
                     (merge default-options options)
                     (atom {:requests 0 :bytes-fetched 0 :cache-hits 0})
                     (atom []))))

(defn stats
  "`{:requests n :bytes-fetched n :cache-hits n}` since the last reset.

  Both numbers are reported because a window trades one for the other, and a
  claim about round trips that does not say what it fetched is half a claim."
  [^PackBlockStore store] @(.-stats store))

(defn reset-stats! [^PackBlockStore store]
  (reset! (.-stats store) {:requests 0 :bytes-fetched 0 :cache-hits 0}))

(defn drop-cache! [^PackBlockStore store] (reset! (.-cache store) []))
