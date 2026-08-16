# kotobase-storage-pack

**An `IBlockStore` whose blocks live inside CARv2 packs on an object store.**

A decorator, not a transport. Give it any large-object store that implements
`IRangeRead` and it becomes a block store with the `:packed-blocks` profile —
the same S3, R2, B2 or in-memory provider serves both planes, and nothing new
has to be deployed.

```clojure
(require '[kotobase.storage.pack :as pack]
         '[kotobase.storage.core :as storage])

(def store (pack/pack-block-store objects (pack/memory-catalog)))

(storage/-put-blocks! store blocks)   ; one call seals exactly one pack
(storage/-get-blocks store cids)      ; one range request per coalesced run
(pack/stats store)                    ; {:requests n :bytes-fetched n :cache-hits n}
```

## The measurement it exists for

The cost of a read here is **requests, not bytes**. Production `kotobase.net`
spends 92 % of a query in hydration, and 97 % of hydration's *sequential* term
is the novelty cons chain — `{e, rest}`, width 1, and the next CID does not
exist until the previous block is decoded (root ADR-2608021000). Batching
cannot help: the caller genuinely cannot ask for the second block yet.

Walking a 100-link chain, one `-get-blocks` per link, exactly as a hydrate
loop must:

| | requests | bytes fetched |
|---|---|---|
| `:window-bytes 0` (no read-ahead) | **100** | 8,730 |
| default (1 MiB window) | **1** | 12,760 |

Identical numbers on JVM and nbb. The suite prints them on every run.

**Packing alone does not buy that.** A pack store that answers each call with
its own range request pays one round trip per link; the blocks merely happen
to be neighbours in one object. What buys it is that they *are* neighbours:
the first fetch takes a window rather than a frame, and the rest of the chain
is already in hand. The chain stays sequential in logic and stops being
sequential on the network.

That row of the table is a real test
(`without-a-window-the-chain-costs-one-request-per-link`), because the claim
is about the window and a suite that only showed the good number would be
evidence for packing in general, which is not what was measured.

**A window is a trade and both halves are reported.** 100 requests became 1 at
the cost of 46 % more bytes. `stats` returns `:requests` and `:bytes-fetched`
together for that reason — a round-trip claim that does not say what it
fetched is half a claim.

## The honest limits

- **Packing helps only where the policy put the blocks together.** Two packs
  cost two requests however the caller batches
  (`separate-packs-cost-separate-requests`). This library does not decide
  what to pack: `-put-blocks!` seals one pack per call, which makes
  write-locality the caller's decision and one commit the natural unit.
- **A gap wider than `:max-gap-bytes` is not coalesced.** Dragging along the
  frames between two wanted ones is only free up to a point.
- **The window extends forward, never backward**, because the chain runs
  forward; extending backward would fetch what the caller has already passed.
- **Cached windows are never stale** — packs are immutable, so cache
  invalidation is not a problem this layer has.
- Every block is CID-verified on the way out. A flipped byte inside a
  well-formed frame is caught by nothing else, and the bytes came from a store
  the engine does not trust (`a-tampered-pack-fails-closed`).

## Where the catalog lives

Two questions, two owners:

| question | answered by |
|---|---|
| which **pack** holds this CID | the datom-plane catalog — it has to join with commits, tenants and lake objects |
| where **inside** that pack | the pack's own CARv2 `MultihashIndexSorted`, or the catalog's offsets |

The catalog arrives here as two injected functions (`:lookup`, `:record!`), so
this library never owns it. `memory-catalog` is the oracle and is enough for a
single process.

## Why it is not inside `kotobase-storage`

`kotobase-storage` is deliberately zero-dependency — it sits under every
provider including Worker builds. The CAR codec pulls `io-ipld` → `cbor` and
`multiformats` → `@noble/hashes`. That floor is worth keeping, so the
decorator lives one repo out.

```bash
clojure -M:test                                        # 11 tests / 29 assertions
npx nbb --classpath "$(clojure -Spath)" run-tests.cljs  # same, on SCI
```

Design: root `90-docs/adr/2608160100-kotobase-physical-plane-ipld-carv2-pack.edn`.
Codec: [`kotoba-lang/io-ipld-car`](https://github.com/kotoba-lang/io-ipld-car).
