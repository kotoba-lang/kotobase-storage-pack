(ns kotobase.storage.pack-plan
  "The pure half of a packed read: which ranges to ask for, and how to turn a
  window of bytes back into blocks.

  It is a separate namespace because there are two drivers — a synchronous
  one for the JVM and a Promise-returning one for a Worker — and the only
  thing that differs between them is the fetch. Everything that decides
  *what* to fetch, and everything that verifies what came back, is here and
  is shared. Two copies of a coalescing rule is two coalescing rules."
  (:require [ipld.car.bytes :as b]
            [ipld.car.v2 :as v2]))

(def zero-stats
  "The counters a store starts with, and the shape `reset-stats!` restores.

  `:blocks-served` is the evidence floor. Without it `{:requests 0}` is what
  a perfectly efficient read and a read that never happened both look like,
  and the second is the one that happens when a catalog lookup silently
  returns nothing. A reader that has served no blocks has not proved
  anything about round trips, whatever the request count says — so the
  denominator is reported next to the numerator, always."
  {:requests 0 :bytes-fetched 0 :cache-hits 0 :blocks-served 0})

(defn summarise
  "Add the derived reading to raw counters, including the one case a caller
  must not mistake for a good result."
  [counters]
  (assoc counters
         :requests-per-block (when (pos? (:blocks-served counters))
                               (/ (:requests counters)
                                  (:blocks-served counters)))
         :evidence (if (pos? (:blocks-served counters)) :served :nothing-served)))

(def default-options
  {:window-bytes 1048576   ; read-ahead ceiling for one request
   :max-gap-bytes 65536    ; coalesce two wanted frames across a gap this big
   :cache-bytes 8388608})  ; total held windows before the oldest is dropped

(defn plan-runs
  "Group located entries of ONE pack into coalesced runs.

  `[{:file-offset n :frame-length n} ...]` →
  `[{:run-start n :run-end n :wanted [...]} ...]`"
  [located max-gap]
  (let [sorted (sort-by :file-offset located)]
    (reduce
     (fn [acc {:keys [file-offset frame-length] :as e}]
       (let [end (+ file-offset frame-length)
             {:keys [run-end] :as last-run} (peek acc)]
         (if (and last-run (<= (- file-offset run-end) max-gap))
           (conj (pop acc) (-> last-run
                               (assoc :run-end (max run-end end))
                               (update :wanted conj e)))
           (conj acc {:run-start file-offset :run-end end :wanted [e]}))))
     []
     sorted)))

(defn window-request
  "The byte range to actually ask for, given a run and a read-ahead ceiling.

  The window extends the request FORWARD — never backward — because the
  chain this exists for runs forward, and extending backward would fetch
  what the caller has already passed."
  [{:keys [run-start run-end]} window-bytes]
  (let [want (- run-end run-start)]
    {:start run-start
     :end (max run-end (+ run-start (max want window-bytes)))}))

(defn frames-from-window
  "Parse and CID-verify every wanted frame that `window` actually covers.

  A frame the window did not reach is omitted rather than truncated:
  `-get-blocks` omits what is missing, and a short block would be a wrong
  answer rather than a missing one."
  [window base wanted]
  (reduce (fn [acc {:keys [file-offset frame-length]}]
            (let [rel (- file-offset base)]
              (if (or (neg? rel) (> (+ rel frame-length) (b/bcount window)))
                acc
                (let [frame (v2/read-frame window rel)]
                  (assoc acc (:cid frame) (:bytes frame))))))
          {}
          wanted))

;; ── held windows ────────────────────────────────────────────────────────────
;; Packs are immutable, so a held window is never stale. Cache invalidation is
;; not a problem this layer has.

(defn cache-put [cache pack-cid start bytes limit]
  (let [entry {:pack-cid pack-cid :start start
               :end (+ start (b/bcount bytes)) :bytes bytes}
        held (conj (vec cache) entry)]
    (loop [held held total (reduce + 0 (map #(b/bcount (:bytes %)) held))]
      (if (and (> total limit) (seq (rest held)))
        (recur (vec (rest held)) (- total (b/bcount (:bytes (first held)))))
        held))))

(defn cache-hit
  "A held window covering `[start, end)` of `pack-cid`, or nil."
  [cache pack-cid start end]
  (some (fn [e]
          (when (and (= pack-cid (:pack-cid e))
                     (<= (:start e) start)
                     (<= end (:end e)))
            e))
        cache))

;; ── bootstrap: a pack locates its own blocks ────────────────────────────────

(defn entries-of
  "Every block in a pack, located, from the pack's own bytes — no catalog.

  This is what makes the catalog a projection rather than a premise. A
  catalog that had to be consulted to read the blocks it is stored in would
  be circular; because a pack carries a CARv2 index, its contents can always
  be recovered from the pack alone, and a lost catalog costs a scan rather
  than the data."
  [pack-cid bytes]
  (let [hdr (v2/parse-header bytes)
        records (v2/read-index bytes)]
    (if records
      (mapv (fn [{:keys [payload-offset]}]
              ;; The index stores where a frame starts, not how long it is,
              ;; so the length comes from parsing the frame itself.
              (let [file-offset (+ (:data-offset hdr) payload-offset)
                    frame (v2/read-frame bytes file-offset)]
                {:cid (:cid frame) :pack-cid pack-cid
                 :file-offset file-offset
                 :frame-length (:frame-length frame)}))
            records)
      ;; No index: fall back to a full walk, which is the same answer at the
      ;; cost of reading every frame.
      (mapv (fn [{:keys [cid frame-offset frame-length]}]
              {:cid cid :pack-cid pack-cid
               :file-offset frame-offset :frame-length frame-length})
            (:entries (v2/read-all bytes))))))
