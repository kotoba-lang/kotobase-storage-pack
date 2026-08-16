(ns kotobase.storage.pack-test
  (:require #?(:clj [clojure.test :refer [deftest is testing]]
               :cljs [cljs.test :refer [deftest is testing]])
            [ipld.car.bytes :as b]
            [ipld.core :as ipld]
            [kotobase.storage.core :as storage]
            [kotobase.storage.object :as object]
            [kotobase.storage.object-memory :as omem]
            [kotobase.storage.pack :as pack]))

(defn- fixture
  ([] (fixture {}))
  ([opts]
   (let [objects (omem/memory-object-store)
         catalog (pack/memory-catalog)]
     {:objects objects
      :catalog catalog
      :store (pack/pack-block-store objects catalog opts)})))

(defn- leaf [i] (ipld/node->block {"kind" "leaf" "v" i}))

;; A cons chain: each node names the next, so the reader cannot know the
;; second CID until it has decoded the first. This is the shape that made the
;; measurement worth taking — 97 % of hydration's sequential term
;; (root ADR-2608021000).
(defn- cons-chain [n]
  (loop [i (dec n) next-cid nil acc ()]
    (if (neg? i)
      (vec acc)
      (let [blk (ipld/node->block
                 (cond-> {"e" i}
                   next-cid (assoc "rest" (ipld/link next-cid))))]
        (recur (dec i) (:cid blk) (conj acc blk))))))

(defn- walk-chain!
  "Follow the chain the way a hydrate loop must: one `-get-blocks` per link,
  because the next CID does not exist until this block is decoded."
  [store head-cid]
  (loop [cid head-cid seen []]
    (if-not cid
      seen
      (let [bytes (get (storage/-get-blocks store [cid]) cid)
            node (ipld/decode bytes)]
        (recur (some-> (get node "rest") ipld/link-cid) (conj seen (get node "e")))))))

;; ── the contract it claims to implement ─────────────────────────────────────

(deftest it-is-a-block-store-with-the-packed-profile
  (let [{:keys [store]} (fixture)]
    (is (storage/block-backend? store))
    (is (= store (storage/validate-block-store! store)))
    (is (= :packed-blocks (storage/block-profile store)))
    (is (true? (storage/packed? store)))
    (is (= store (storage/validate-block-profile! store))
        "it answers the question rather than leaving it open")))

(deftest an-object-store-without-range-read-is-refused
  (testing "the only implementation left would fetch a whole pack per block"
    (let [no-range (reify
                     object/IObjectStore
                     (-stat-object [_ _] nil)
                     (-delete-object! [_ _] {:deleted? false :reason :not-supported})
                     object/IProxiedTransfer
                     (-put-object! [_ _ _] {:size-bytes 0})
                     (-get-object [_ _] nil)
                     object/IObjectCapabilities
                     (-object-capabilities [_] #{:large-objects :proxied-transfer}))]
      (is (thrown? #?(:clj Exception :cljs js/Error)
                   (pack/pack-block-store no-range (pack/memory-catalog)))))))

(deftest blocks-round-trip-through-a-pack
  (let [{:keys [store objects]} (fixture)
        blocks (mapv leaf (range 5))]
    (storage/-put-blocks! store blocks)
    (is (= 1 (count (omem/snapshot objects)))
        "one call sealed exactly one pack")
    (let [got (storage/-get-blocks store (mapv :cid blocks))]
      (is (= (set (map :cid blocks)) (set (keys got))))
      (doseq [{:keys [cid bytes]} blocks]
        (is (b/equal? bytes (get got cid)))))))

(deftest a-cid-nobody-packed-is-omitted-not-invented
  (let [{:keys [store]} (fixture)
        blocks (mapv leaf (range 3))]
    (storage/-put-blocks! store blocks)
    (let [absent (:cid (leaf 99))
          got (storage/-get-blocks store [(:cid (first blocks)) absent])]
      (is (= 1 (count got)))
      (is (nil? (get got absent))))))

(deftest a-tampered-pack-fails-closed
  (testing "the bytes came from an object store the engine does not trust"
    (let [{:keys [store objects catalog]} (fixture)
          blocks (mapv leaf (range 3))
          _ (storage/-put-blocks! store blocks)
          [pack-cid packed] (first (omem/snapshot objects))
          target-cid (:cid (first blocks))
          {:keys [file-offset frame-length]} (get ((:lookup catalog) [target-cid])
                                                  target-cid)]
      (is (some? file-offset) "the catalog located the frame")
      (is (pos? frame-length))
      ;; flip the last byte of that frame: still a well-formed frame, just
      ;; different bytes, so only the CID check can catch it
      (let [target (dec (+ file-offset frame-length))
            v (b/as-bytes packed)
            flipped (b/concat [(b/slice v 0 target)
                               (b/->bytes [(bit-xor 0xff (b/bget v target))])
                               (b/slice v (inc target) (b/bcount v))])]
        (object/-put-object! objects pack-cid flipped)
        (pack/drop-cache! store)
        (is (thrown? #?(:clj Exception :cljs js/Error)
                     (storage/-get-blocks store [target-cid])))))))

;; ── the measurement the design rests on ─────────────────────────────────────

(deftest one-request-serves-a-whole-cons-chain
  (testing "the chain is still sequential; the network is not"
    (let [chain (cons-chain 100)
          {:keys [store]} (fixture)]
      (storage/-put-blocks! store chain)
      (pack/drop-cache! store)
      (pack/reset-stats! store)
      (let [seen (walk-chain! store (:cid (first chain)))
            {:keys [requests cache-hits bytes-fetched]} (pack/stats store)]
        (is (= (range 100) seen) "every link was actually followed")
        (is (= 1 requests)
            "100 links, 1 range request — the window held the rest")
        (is (= 99 cache-hits))
        (is (pos? bytes-fetched))))))

(deftest without-a-window-the-chain-costs-one-request-per-link
  (testing "the negative control: packing alone does not buy this, the
            read-ahead does. Without it a pack store pays exactly what a
            block-per-object store pays"
    (let [chain (cons-chain 100)
          {:keys [store]} (fixture {:window-bytes 0 :cache-bytes 0})]
      (storage/-put-blocks! store chain)
      (pack/drop-cache! store)
      (pack/reset-stats! store)
      (walk-chain! store (:cid (first chain)))
      (is (= 100 (:requests (pack/stats store)))))))

(deftest the-window-is-a-trade-and-both-halves-are-reported
  (let [chain (cons-chain 100)
        windowed (fixture)
        narrow (fixture {:window-bytes 0 :cache-bytes 0})]
    (doseq [{:keys [store]} [windowed narrow]]
      (storage/-put-blocks! store chain)
      (pack/drop-cache! store)
      (pack/reset-stats! store)
      (walk-chain! store (:cid (first chain))))
    (let [w (pack/stats (:store windowed))
          n (pack/stats (:store narrow))]
      (is (< (:requests w) (:requests n)) "fewer round trips")
      (is (>= (:bytes-fetched w) (:bytes-fetched n))
          "and not fewer bytes — a window pays for requests with transfer")
      (println "  cons-chain(100):"
               "windowed" (pr-str w) " narrow" (pr-str n)))))

(deftest a-batch-read-coalesces-into-one-request
  (let [{:keys [store]} (fixture {:window-bytes 0 :cache-bytes 0})
        blocks (mapv leaf (range 20))]
    (storage/-put-blocks! store blocks)
    (pack/drop-cache! store)
    (pack/reset-stats! store)
    (let [got (storage/-get-blocks store (mapv :cid blocks))]
      (is (= 20 (count got)))
      (is (= 1 (:requests (pack/stats store)))
          "adjacent frames coalesce even with read-ahead switched off"))))

(deftest separate-packs-cost-separate-requests
  (testing "the honest limit: packing helps only where the policy put the
            blocks together"
    (let [{:keys [store]} (fixture {:window-bytes 0 :cache-bytes 0})
          a (mapv leaf (range 0 5))
          b (mapv leaf (range 100 105))]
      (storage/-put-blocks! store a)
      (storage/-put-blocks! store b)
      (pack/drop-cache! store)
      (pack/reset-stats! store)
      (storage/-get-blocks store (mapv :cid (concat a b)))
      (is (= 2 (:requests (pack/stats store)))
          "two packs, two requests, however the caller batched"))))

(deftest a-gap-wider-than-the-ceiling-is-not-coalesced
  (let [{:keys [store]} (fixture {:window-bytes 0 :cache-bytes 0 :max-gap-bytes 8})
        blocks (mapv leaf (range 12))]
    (storage/-put-blocks! store blocks)
    (pack/drop-cache! store)
    (pack/reset-stats! store)
    (storage/-get-blocks store [(:cid (first blocks)) (:cid (last blocks))])
    (is (= 2 (:requests (pack/stats store)))
        "the frames between them are not worth dragging along")))

(deftest zero-requests-is-not-evidence-of-anything
  (testing "the counter that had to exist: {:requests 0} is what a perfectly
            efficient read and a read that never happened both look like, and
            the second is what a catalog lookup returning nothing produces"
    (let [{:keys [store]} (fixture)
          blocks (mapv leaf (range 3))]
      (storage/-put-blocks! store blocks)
      (pack/reset-stats! store)
      ;; nobody asked for anything this store knows about
      (is (= {} (storage/-get-blocks store [(:cid (leaf 999))])))
      (let [s (pack/stats store)]
        (is (zero? (:requests s)))
        (is (zero? (:blocks-served s)))
        (is (= :nothing-served (:evidence s))
            "and it says so rather than reading as a flawless result")
        (is (nil? (:requests-per-block s))
            "no denominator, so no ratio -- not a ratio of zero")))
    (let [{:keys [store]} (fixture)
          blocks (mapv leaf (range 3))]
      (storage/-put-blocks! store blocks)
      (pack/drop-cache! store)
      (pack/reset-stats! store)
      (storage/-get-blocks store (mapv :cid blocks))
      (let [s (pack/stats store)]
        (is (= 3 (:blocks-served s)))
        (is (= :served (:evidence s)))
        (is (= 1/3 (:requests-per-block s))
            "one request for three blocks is the figure of merit, and it is
             only meaningful because the denominator is real")))))
