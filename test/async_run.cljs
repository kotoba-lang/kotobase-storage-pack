(ns async-run
  "The Promise-returning packed block store.

  Same claim as the synchronous suite and a different runtime: on a Worker
  every object read is a Promise, so a store that used the answer directly
  would not run there at all. The numbers must come out the same, because
  the plan is the same code."
  (:require [ipld.car.bytes :as b]
            [ipld.core :as ipld]
            [kotobase.storage.core :as storage]
            [kotobase.storage.object :as object]
            [kotobase.storage.object-memory :as omem]
            [kotobase.storage.pack :as pack]
            [kotobase.storage.pack-async :as apack]))

(def ^:private failures (atom 0))

(defn- expect [ok? message]
  (if ok?
    (println (str "ok  - " message))
    (do (js/console.error (str "FAIL: " message)) (swap! failures inc))))

(defrecord AsyncObjects [inner]
  object/IObjectStore
  (-stat-object [_ cid] (js/Promise.resolve (object/-stat-object inner cid)))
  (-delete-object! [_ cid] (js/Promise.resolve (object/-delete-object! inner cid)))
  object/IProxiedTransfer
  (-put-object! [_ cid bytes] (js/Promise.resolve (object/-put-object! inner cid bytes)))
  (-get-object [_ cid] (js/Promise.resolve (object/-get-object inner cid)))
  object/IRangeRead
  (-get-object-range [_ cid start end]
    (js/Promise.resolve (object/-get-object-range inner cid start end)))
  object/IObjectCapabilities
  (-object-capabilities [_] (object/-object-capabilities inner)))

(defn- async-objects [] (->AsyncObjects (omem/memory-object-store)))

(defn- cons-chain [n]
  (loop [i (dec n) next-cid nil acc ()]
    (if (neg? i)
      (vec acc)
      (let [blk (ipld/node->block
                 (cond-> {"e" i} next-cid (assoc "rest" (ipld/link next-cid))))]
        (recur (dec i) (:cid blk) (conj acc blk))))))

(defn- walk-chain!
  "Follow the chain one link at a time, as a hydrate loop must."
  [store head-cid seen]
  (-> (storage/-get-blocks store [head-cid])
      (.then (fn [got]
               (let [node (ipld/decode (get got head-cid))
                     nxt (some-> (get node "rest") ipld/link-cid)
                     seen (conj seen (get node "e"))]
                 (if nxt (walk-chain! store nxt seen) (js/Promise.resolve seen)))))))

(defn- measure [opts]
  (let [objects (async-objects)
        chain (cons-chain 100)
        store (apack/pack-block-store objects (pack/memory-catalog) opts)]
    (-> (storage/-put-blocks! store chain)
        (.then (fn [_]
                 (apack/drop-cache! store)
                 (apack/reset-stats! store)
                 (walk-chain! store (:cid (first chain)) [])))
        (.then (fn [seen] {:seen seen :stats (apack/stats store)
                           :objects objects :chain chain})))))

(defn -main [& _]
  (-> (measure {})
      (.then
       (fn [{:keys [seen stats]}]
         (expect (= (range 100) seen) "every link was actually followed")
         (expect (= 1 (:requests stats))
                 (str "100 links, 1 range request on the Promise path: "
                      (pr-str stats)))
         (expect (= 99 (:cache-hits stats)) "and 99 of them came from the window")))

      (.then (fn [_] (measure {:window-bytes 0 :cache-bytes 0})))
      (.then
       (fn [{:keys [stats]}]
         (expect (= 100 (:requests stats))
                 (str "without a window the same walk costs 100: " (pr-str stats)))))

      ;; the catalog is a projection, and this is what makes that checkable
      (.then (fn [_]
               (let [objects (async-objects)
                     blocks (mapv #(ipld/node->block {"kind" "leaf" "v" %}) (range 5))
                     catalog (pack/memory-catalog)
                     store (apack/pack-block-store objects catalog)]
                 (-> (storage/-put-blocks! store blocks)
                     (.then (fn [_]
                              (let [pack-cid (:pack-cid (first (vals ((:snapshot catalog)))))]
                                (apack/rebuild-catalog! objects pack-cid))))
                     (.then (fn [recovered]
                              (let [original ((:snapshot catalog))]
                                (expect (= (set (keys original))
                                           (set (map :cid recovered)))
                                        "a lost catalog is recovered from the pack itself")
                                (expect (= (select-keys (get original (:cid (first recovered)))
                                                        [:file-offset :frame-length])
                                           (select-keys (first recovered)
                                                        [:file-offset :frame-length]))
                                        "with the same offsets the writer recorded"))))))))

      (.then (fn [_]
               (if (zero? @failures)
                 (println "async packed block store: all green")
                 (do (println (str "async packed block store: " @failures
                                   " FAILURE(S) above"))
                     (js/process.exit 1)))))
      (.catch (fn [e]
                (js/console.error (str "async runner threw: " e))
                (js/process.exit 1)))))

(-main)
