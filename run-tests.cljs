(ns run-tests
  "The pack suite on nbb — the runtime the Worker read path resembles.

     nbb --classpath \"$(clojure -Spath)\" run-tests.cljs"
  (:require [cljs.test :as t]
            [kotobase.storage.pack-test]))

(defmethod t/report [:cljs.test/default :end-run-tests] [m]
  (println (str "\nnbb: " (:test m) " tests, " (:pass m) " passed, "
                (:fail m) " failed, " (:error m) " errors"))
  (when (pos? (+ (or (:fail m) 0) (or (:error m) 0)))
    (set! (.-exitCode js/process) 1)))

(t/run-tests 'kotobase.storage.pack-test)
