(ns kotobase.storage.pack-async
  "The packed block store for a Worker: same plan, Promise-returning fetch.

  `kotobase.storage.pack` calls `-get-object-range` and uses the answer. On
  Cloudflare that answer is a Promise, so the synchronous store cannot run on
  the platform the pack plane was designed for — a Worker holding an R2
  binding, reading kilobytes out of a pack. This namespace is that store.

  Only the fetch differs. Coalescing, the read-ahead window, the held-window
  cache and frame verification are `kotobase.storage.pack-plan`, shared, so
  the two drivers cannot drift into two coalescing rules.

  Runs are fetched sequentially rather than in parallel. Within one call
  coalescing has already merged what is adjacent, so what remains is separate
  packs; fetching them in order keeps `stats` a straightforward count and
  lets a later run hit a window an earlier one filled. Parallelism here would
  buy latency on a multi-pack read and cost the property the measurement
  depends on."
  (:require [ipld.car.bytes :as b]
            [kotobase.storage.core :as storage]
            [kotobase.storage.object :as object]
            [kotobase.storage.pack-plan :as plan]
            [ipld.car.v2 :as v2]
            [multiformats.core :as mf]))

(defn- promised [x] (js/Promise.resolve x))

(defn- fetch-run!
  [{:keys [objects stats window-bytes cache-bytes cache]} pack-cid run]
  (if-let [hit (plan/cache-hit @cache pack-cid (:run-start run) (:run-end run))]
    (do (swap! stats update :cache-hits inc)
        (promised {:base (:start hit) :bytes (:bytes hit)}))
    (let [{:keys [start end]} (plan/window-request run window-bytes)]
      (-> (promised (object/-get-object-range objects pack-cid start end))
          (.then (fn [bytes]
                   (swap! stats
                          (fn [s] (-> s
                                      (update :requests inc)
                                      (update :bytes-fetched +
                                              (if bytes (b/bcount bytes) 0)))))
                   (when bytes
                     (swap! cache plan/cache-put pack-cid start bytes cache-bytes)
                     {:base start :bytes bytes})))))))

(defn- read-runs [ctx pack-cid runs acc]
  (if-let [run (first runs)]
    (-> (fetch-run! ctx pack-cid run)
        (.then (fn [window]
                 (read-runs ctx pack-cid (rest runs)
                            (if window
                              (let [got (plan/frames-from-window
                                         (:bytes window) (:base window)
                                         (:wanted run))]
                                (swap! (:stats ctx) update :blocks-served
                                       + (count got))
                                (merge acc got))
                              acc)))))
    (promised acc)))

(defn- read-packs [ctx groups acc]
  (if-let [[pack-cid es] (first groups)]
    (-> (read-runs ctx pack-cid (plan/plan-runs es (:max-gap-bytes ctx)) acc)
        (.then (fn [acc] (read-packs ctx (rest groups) acc))))
    (promised acc)))

(defn seal-pack!
  "Pack `blocks` into one CARv2, store it as one object, record the catalog.

  Resolves to `{:pack-cid s :size-bytes n :entries [...]}`."
  [{:keys [objects catalog roots]} blocks]
  (if-not (seq blocks)
    (promised nil)
    (let [{:keys [bytes entries]} (v2/pack {:roots (vec roots) :blocks blocks})
          pack-cid (mf/cidv1-raw (b/as-bytes bytes))
          recorded (mapv (fn [{:keys [cid file-offset frame-length]}]
                           {:cid cid :pack-cid pack-cid
                            :file-offset file-offset :frame-length frame-length})
                         entries)]
      (-> (promised (object/-put-object! objects pack-cid bytes))
          (.then (fn [_] (promised ((:record! catalog) recorded))))
          (.then (fn [_]
                   (let [summary {:pack-cid pack-cid
                                  :size-bytes (b/bcount bytes)
                                  :entries recorded}]
                     (if-let [record-pack! (:record-pack! catalog)]
                       (-> (promised (record-pack! summary))
                           (.then (fn [_] summary)))
                       (promised summary)))))))))

(defrecord AsyncPackBlockStore [objects catalog options stats cache]
  storage/IBlockStore
  (-put-blocks! [_ blocks]
    (-> (seal-pack! {:objects objects :catalog catalog} blocks)
        (.then (fn [_] (mapv :cid blocks)))))
  (-get-blocks [_ cids]
    (-> (promised ((:lookup catalog) (vec cids)))
        (.then (fn [located]
                 (read-packs (assoc options :objects objects
                                    :stats stats :cache cache)
                             (seq (group-by :pack-cid (vals located)))
                             {})))))

  storage/IBackendCapabilities
  (-capabilities [_]
    #{:immutable-blocks :cid-addressed-read :packed-blocks :range-read}))

(defn pack-block-store
  "Compose an object store and a catalog into an async packed block store."
  ([objects catalog] (pack-block-store objects catalog {}))
  ([objects catalog options]
   (when-not (object/range-read? objects)
     (throw (ex-info "A packed block store needs an object store with :range-read"
                     {:type :kotobase.storage.pack/no-range-read
                      :declared (object/-object-capabilities objects)})))
   (->AsyncPackBlockStore objects catalog
                          (merge plan/default-options options)
                          (atom plan/zero-stats)
                          (atom []))))

(defn stats
  "Counters plus how to read them — see `kotobase.storage.pack/stats`."
  [^AsyncPackBlockStore store] (plan/summarise @(.-stats store)))
(defn reset-stats! [^AsyncPackBlockStore store]
  (reset! (.-stats store) plan/zero-stats))
(defn drop-cache! [^AsyncPackBlockStore store] (reset! (.-cache store) []))

(defn rebuild-catalog!
  "Recover a pack's catalog entries from the pack itself.

  The catalog is a projection, and this is the function that makes that
  claim checkable: delete it and a scan puts it back, because a pack carries
  a CARv2 index of its own contents. It also settles the circularity the
  design would otherwise have — a catalog that had to be read to locate the
  blocks it is stored in could never be bootstrapped."
  [objects pack-cid]
  (-> (promised (object/-get-object objects pack-cid))
      (.then (fn [bytes]
               (when bytes (plan/entries-of pack-cid bytes))))))
