(ns run-tests
  "The pack suite on nbb — the runtime the Worker read path resembles.

     nbb --classpath \"$(clojure -Spath)\" run-tests.cljs"
  (:require [cljs.test :as t]
            [kotobase.storage.pack-test]
            ;; The drill runs here too, not only on the JVM. `chain-step`
            ;; catches `:default` rather than `Throwable` on this runtime and
            ;; reads the message off the object rather than through
            ;; `ex-message`, so a recovery path that works on the JVM and not
            ;; here is exactly the bug a cljc file can hide.
            [kotobase.storage.pack-recovery-test]))

(defmethod t/report [:cljs.test/default :end-run-tests] [m]
  (println (str "\nnbb: " (:test m) " tests, " (:pass m) " passed, "
                (:fail m) " failed, " (:error m) " errors"))
  (when (pos? (+ (or (:fail m) 0) (or (:error m) 0)))
    (set! (.-exitCode js/process) 1)))

(t/run-tests 'kotobase.storage.pack-test
             'kotobase.storage.pack-recovery-test)
