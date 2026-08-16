// Compiled by ClojureScript 1.11.132 {:target :nodejs, :nodejs-rt true, :optimizations :none}
goog.provide('kotobase.storage.core');
goog.require('cljs.core');

/**
 * @interface
 */
kotobase.storage.core.IBlockStore = function(){};

var kotobase$storage$core$IBlockStore$_put_blocks_BANG_$dyn_526 = (function (store,blocks){
var x__5350__auto__ = (((store == null))?null:store);
var m__5351__auto__ = (kotobase.storage.core._put_blocks_BANG_[goog.typeOf(x__5350__auto__)]);
if((!((m__5351__auto__ == null)))){
return m__5351__auto__.call(null,store,blocks);
} else {
var m__5349__auto__ = (kotobase.storage.core._put_blocks_BANG_["_"]);
if((!((m__5349__auto__ == null)))){
return m__5349__auto__.call(null,store,blocks);
} else {
throw cljs.core.missing_protocol.call(null,"IBlockStore.-put-blocks!",store);
}
}
});
/**
 * Idempotently persist [{:cid string :bytes bytes} ...].
 */
kotobase.storage.core._put_blocks_BANG_ = (function kotobase$storage$core$_put_blocks_BANG_(store,blocks){
if((((!((store == null)))) && ((!((store.kotobase$storage$core$IBlockStore$_put_blocks_BANG_$arity$2 == null)))))){
return store.kotobase$storage$core$IBlockStore$_put_blocks_BANG_$arity$2(store,blocks);
} else {
return kotobase$storage$core$IBlockStore$_put_blocks_BANG_$dyn_526.call(null,store,blocks);
}
});

var kotobase$storage$core$IBlockStore$_get_blocks$dyn_527 = (function (store,cids){
var x__5350__auto__ = (((store == null))?null:store);
var m__5351__auto__ = (kotobase.storage.core._get_blocks[goog.typeOf(x__5350__auto__)]);
if((!((m__5351__auto__ == null)))){
return m__5351__auto__.call(null,store,cids);
} else {
var m__5349__auto__ = (kotobase.storage.core._get_blocks["_"]);
if((!((m__5349__auto__ == null)))){
return m__5349__auto__.call(null,store,cids);
} else {
throw cljs.core.missing_protocol.call(null,"IBlockStore.-get-blocks",store);
}
}
});
/**
 * Return a map of present CID strings to bytes. Missing CIDs are omitted.
 */
kotobase.storage.core._get_blocks = (function kotobase$storage$core$_get_blocks(store,cids){
if((((!((store == null)))) && ((!((store.kotobase$storage$core$IBlockStore$_get_blocks$arity$2 == null)))))){
return store.kotobase$storage$core$IBlockStore$_get_blocks$arity$2(store,cids);
} else {
return kotobase$storage$core$IBlockStore$_get_blocks$dyn_527.call(null,store,cids);
}
});


/**
 * @interface
 */
kotobase.storage.core.IRefStore = function(){};

var kotobase$storage$core$IRefStore$_read_ref$dyn_528 = (function (store,ref_name){
var x__5350__auto__ = (((store == null))?null:store);
var m__5351__auto__ = (kotobase.storage.core._read_ref[goog.typeOf(x__5350__auto__)]);
if((!((m__5351__auto__ == null)))){
return m__5351__auto__.call(null,store,ref_name);
} else {
var m__5349__auto__ = (kotobase.storage.core._read_ref["_"]);
if((!((m__5349__auto__ == null)))){
return m__5349__auto__.call(null,store,ref_name);
} else {
throw cljs.core.missing_protocol.call(null,"IRefStore.-read-ref",store);
}
}
});
/**
 * Return nil or {:cid string :version provider-token}.
 */
kotobase.storage.core._read_ref = (function kotobase$storage$core$_read_ref(store,ref_name){
if((((!((store == null)))) && ((!((store.kotobase$storage$core$IRefStore$_read_ref$arity$2 == null)))))){
return store.kotobase$storage$core$IRefStore$_read_ref$arity$2(store,ref_name);
} else {
return kotobase$storage$core$IRefStore$_read_ref$dyn_528.call(null,store,ref_name);
}
});

var kotobase$storage$core$IRefStore$_compare_and_set_ref_BANG_$dyn_529 = (function (store,ref_name,expected_cid,next_cid){
var x__5350__auto__ = (((store == null))?null:store);
var m__5351__auto__ = (kotobase.storage.core._compare_and_set_ref_BANG_[goog.typeOf(x__5350__auto__)]);
if((!((m__5351__auto__ == null)))){
return m__5351__auto__.call(null,store,ref_name,expected_cid,next_cid);
} else {
var m__5349__auto__ = (kotobase.storage.core._compare_and_set_ref_BANG_["_"]);
if((!((m__5349__auto__ == null)))){
return m__5349__auto__.call(null,store,ref_name,expected_cid,next_cid);
} else {
throw cljs.core.missing_protocol.call(null,"IRefStore.-compare-and-set-ref!",store);
}
}
});
/**
 * Publish NEXT only when the current CID equals EXPECTED.
 *   Return {:published? boolean :current cid-or-nil :version token}.
 */
kotobase.storage.core._compare_and_set_ref_BANG_ = (function kotobase$storage$core$_compare_and_set_ref_BANG_(store,ref_name,expected_cid,next_cid){
if((((!((store == null)))) && ((!((store.kotobase$storage$core$IRefStore$_compare_and_set_ref_BANG_$arity$4 == null)))))){
return store.kotobase$storage$core$IRefStore$_compare_and_set_ref_BANG_$arity$4(store,ref_name,expected_cid,next_cid);
} else {
return kotobase$storage$core$IRefStore$_compare_and_set_ref_BANG_$dyn_529.call(null,store,ref_name,expected_cid,next_cid);
}
});


/**
 * @interface
 */
kotobase.storage.core.IBackendCapabilities = function(){};

var kotobase$storage$core$IBackendCapabilities$_capabilities$dyn_530 = (function (store){
var x__5350__auto__ = (((store == null))?null:store);
var m__5351__auto__ = (kotobase.storage.core._capabilities[goog.typeOf(x__5350__auto__)]);
if((!((m__5351__auto__ == null)))){
return m__5351__auto__.call(null,store);
} else {
var m__5349__auto__ = (kotobase.storage.core._capabilities["_"]);
if((!((m__5349__auto__ == null)))){
return m__5349__auto__.call(null,store);
} else {
throw cljs.core.missing_protocol.call(null,"IBackendCapabilities.-capabilities",store);
}
}
});
/**
 * Return a set of backend capability keywords.
 */
kotobase.storage.core._capabilities = (function kotobase$storage$core$_capabilities(store){
if((((!((store == null)))) && ((!((store.kotobase$storage$core$IBackendCapabilities$_capabilities$arity$1 == null)))))){
return store.kotobase$storage$core$IBackendCapabilities$_capabilities$arity$1(store);
} else {
return kotobase$storage$core$IBackendCapabilities$_capabilities$dyn_530.call(null,store);
}
});

kotobase.storage.core.required_capabilities = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"cid-addressed-read","cid-addressed-read",497402566),null,new cljs.core.Keyword(null,"conditional-ref","conditional-ref",-148874350),null,new cljs.core.Keyword(null,"immutable-blocks","immutable-blocks",922448631),null], null), null);
/**
 * How far `-compare-and-set-ref!` actually holds.
 * 
 *   `:conditional-ref` only says the operation exists. It says nothing about
 *   whether two writers can rely on it, and that is the difference between a
 *   backend that rejects a stale publish and one that silently accepts it and
 *   loses an update. Every backend must therefore declare exactly one of:
 * 
 *   - `:linearizable-ref` — the CAS is enforced by the store itself, so
 *  concurrent writers in unrelated processes are safe. Backed by a real
 *  primitive: an ETag precondition the service evaluates, a SQL
 *  transaction, `git update-ref`.
 * 
 *   - `:single-writer-ref` — the CAS holds only within one writer. It may be
 *  serialized in-process, or ride on a transport with no conditional write
 *  at all (IPNS publishes unconditionally; Backblaze B2 has no conditional
 *  put on either API). Correct deployments put one writer in front of it,
 *  or a linearizable ref service.
 * 
 *   The set is closed and the choice is mandatory because the failure mode of
 *   guessing is silent: an ignored precondition returns success.
 */
kotobase.storage.core.ref_profiles = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"linearizable-ref","linearizable-ref",614383747),null,new cljs.core.Keyword(null,"single-writer-ref","single-writer-ref",-1605354288),null], null), null);
kotobase.storage.core.block_store_QMARK_ = (function kotobase$storage$core$block_store_QMARK_(value){
if((!((value == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === value.kotobase$storage$core$IBlockStore$)))){
return true;
} else {
if((!value.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_.call(null,kotobase.storage.core.IBlockStore,value);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_.call(null,kotobase.storage.core.IBlockStore,value);
}
});
kotobase.storage.core.ref_store_QMARK_ = (function kotobase$storage$core$ref_store_QMARK_(value){
if((!((value == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === value.kotobase$storage$core$IRefStore$)))){
return true;
} else {
if((!value.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_.call(null,kotobase.storage.core.IRefStore,value);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_.call(null,kotobase.storage.core.IRefStore,value);
}
});
kotobase.storage.core.backend_QMARK_ = (function kotobase$storage$core$backend_QMARK_(value){
var and__5000__auto__ = kotobase.storage.core.block_store_QMARK_.call(null,value);
if(and__5000__auto__){
var and__5000__auto____$1 = kotobase.storage.core.ref_store_QMARK_.call(null,value);
if(and__5000__auto____$1){
if((!((value == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === value.kotobase$storage$core$IBackendCapabilities$)))){
return true;
} else {
if((!value.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_.call(null,kotobase.storage.core.IBackendCapabilities,value);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_.call(null,kotobase.storage.core.IBackendCapabilities,value);
}
} else {
return and__5000__auto____$1;
}
} else {
return and__5000__auto__;
}
});
/**
 * Which of `ref-profiles` this backend declares, or nil if it declares
 *   none or more than one.
 */
kotobase.storage.core.ref_profile = (function kotobase$storage$core$ref_profile(backend){
var declared = cljs.core.filter.call(null,kotobase.storage.core._capabilities.call(null,backend),kotobase.storage.core.ref_profiles);
if(cljs.core._EQ_.call(null,(1),cljs.core.count.call(null,declared))){
return cljs.core.first.call(null,declared);
} else {
return null;
}
});
/**
 * True when the backend claims its ref CAS survives concurrent writers.
 * 
 *   Read this rather than testing for `:conditional-ref`, which every backend
 *   has and which distinguishes nothing.
 */
kotobase.storage.core.linearizable_QMARK_ = (function kotobase$storage$core$linearizable_QMARK_(backend){
return cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"linearizable-ref","linearizable-ref",614383747),kotobase.storage.core.ref_profile.call(null,backend));
});
kotobase.storage.core.validate_backend_BANG_ = (function kotobase$storage$core$validate_backend_BANG_(var_args){
var G__535 = arguments.length;
switch (G__535) {
case 1:
return kotobase.storage.core.validate_backend_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return kotobase.storage.core.validate_backend_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(kotobase.storage.core.validate_backend_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (backend){
return kotobase.storage.core.validate_backend_BANG_.call(null,backend,kotobase.storage.core.required_capabilities);
}));

(kotobase.storage.core.validate_backend_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (backend,required){
if(kotobase.storage.core.backend_QMARK_.call(null,backend)){
} else {
throw cljs.core.ex_info.call(null,"Kotobase backend does not implement the storage contract",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("kotobase.storage","invalid-backend","kotobase.storage/invalid-backend",-421377376)], null));
}

var missing_537 = cljs.core.remove.call(null,kotobase.storage.core._capabilities.call(null,backend),required);
if(cljs.core.seq.call(null,missing_537)){
throw cljs.core.ex_info.call(null,"Kotobase backend lacks required capabilities",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("kotobase.storage","missing-capabilities","kotobase.storage/missing-capabilities",1549221631),new cljs.core.Keyword(null,"missing","missing",362507769),cljs.core.set.call(null,missing_537)], null));
} else {
}

if(cljs.core.truth_(kotobase.storage.core.ref_profile.call(null,backend))){
} else {
throw cljs.core.ex_info.call(null,"Kotobase backend must declare exactly one ref profile",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("kotobase.storage","undeclared-ref-profile","kotobase.storage/undeclared-ref-profile",-1274699413),new cljs.core.Keyword(null,"expected","expected",1583670997),kotobase.storage.core.ref_profiles,new cljs.core.Keyword(null,"declared","declared",92336021),cljs.core.set.call(null,cljs.core.filter.call(null,kotobase.storage.core._capabilities.call(null,backend),kotobase.storage.core.ref_profiles))], null));
}

return backend;
}));

(kotobase.storage.core.validate_backend_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * What a BLOCK-only backend must declare. Deliberately excludes
 *   `:conditional-ref`: a store that holds immutable CID-addressed bytes has
 *   nothing to be conditional about.
 */
kotobase.storage.core.block_capabilities = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"cid-addressed-read","cid-addressed-read",497402566),null,new cljs.core.Keyword(null,"immutable-blocks","immutable-blocks",922448631),null], null), null);
/**
 * WHERE a block physically lives — the question `IBlockStore` never asked.
 * 
 *   `-get-blocks` describes the operation, not the layout, and the layout is
 *   what a read costs. One object per CID pays one round trip per block; a
 *   store that packs blocks into CARv2 archives pays one per range. The two are
 *   different stores with the same protocol, and a caller cannot tell by trying.
 * 
 *   - `:block-per-object` — one immutable object per CID. Every provider that
 *  existed before 2026-08-16 is this.
 * 
 *   - `:packed-blocks` — blocks live inside CARv2 packs and are fetched by byte
 *  range. Such a store MUST also declare `:range-read`: without it the only
 *  possible implementation is to fetch a whole pack to return one block,
 *  which cuts round trips and multiplies transfer — a failure that reports
 *  success.
 * 
 *   Superproject ADR-2608160100. Unlike `ref-profiles` this is not yet
 *   mandatory, because every existing provider predates it and declaring
 *   nothing must not become a lie about them. **Undeclared is not a default.**
 *   It is an unanswered question, and `block-profile` returns nil for it —
 *   code that needs the answer calls `validate-block-profile!` and refuses.
 */
kotobase.storage.core.block_profiles = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"packed-blocks","packed-blocks",248205991),null,new cljs.core.Keyword(null,"block-per-object","block-per-object",848813259),null], null), null);
/**
 * Which of `block-profiles` this store declares, or nil when it declares
 *   none or more than one. nil means unanswered, not `:block-per-object`.
 */
kotobase.storage.core.block_profile = (function kotobase$storage$core$block_profile(store){
var declared = cljs.core.filter.call(null,kotobase.storage.core._capabilities.call(null,store),kotobase.storage.core.block_profiles);
if(cljs.core._EQ_.call(null,(1),cljs.core.count.call(null,declared))){
return cljs.core.first.call(null,declared);
} else {
return null;
}
});
/**
 * True when the store claims its blocks live in packs and are read by range.
 */
kotobase.storage.core.packed_QMARK_ = (function kotobase$storage$core$packed_QMARK_(store){
return cljs.core._EQ_.call(null,new cljs.core.Keyword(null,"packed-blocks","packed-blocks",248205991),kotobase.storage.core.block_profile.call(null,store));
});
/**
 * Demand an answer. For callers whose read strategy depends on the layout —
 *   a pack-aware reader cannot treat an unanswered store as either kind.
 */
kotobase.storage.core.validate_block_profile_BANG_ = (function kotobase$storage$core$validate_block_profile_BANG_(store){
if(cljs.core.truth_(kotobase.storage.core.block_profile.call(null,store))){
} else {
throw cljs.core.ex_info.call(null,"Kotobase block store must declare exactly one block profile",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("kotobase.storage","undeclared-block-profile","kotobase.storage/undeclared-block-profile",708521299),new cljs.core.Keyword(null,"expected","expected",1583670997),kotobase.storage.core.block_profiles,new cljs.core.Keyword(null,"declared","declared",92336021),cljs.core.set.call(null,cljs.core.filter.call(null,kotobase.storage.core._capabilities.call(null,store),kotobase.storage.core.block_profiles))], null));
}

return store;
});
/**
 * True when `value` can serve blocks, whether or not it can serve refs.
 */
kotobase.storage.core.block_backend_QMARK_ = (function kotobase$storage$core$block_backend_QMARK_(value){
var and__5000__auto__ = kotobase.storage.core.block_store_QMARK_.call(null,value);
if(and__5000__auto__){
if((!((value == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === value.kotobase$storage$core$IBackendCapabilities$)))){
return true;
} else {
if((!value.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_.call(null,kotobase.storage.core.IBackendCapabilities,value);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_.call(null,kotobase.storage.core.IBackendCapabilities,value);
}
} else {
return and__5000__auto__;
}
});
/**
 * Validate a backend used ONLY for blocks. Unlike `validate-backend!` this
 *   demands no ref protocol and no ref profile, so a provider without
 *   conditional writes can be used for the plane where that does not matter.
 */
kotobase.storage.core.validate_block_store_BANG_ = (function kotobase$storage$core$validate_block_store_BANG_(var_args){
var G__540 = arguments.length;
switch (G__540) {
case 1:
return kotobase.storage.core.validate_block_store_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return kotobase.storage.core.validate_block_store_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(arguments.length)].join('')));

}
});

(kotobase.storage.core.validate_block_store_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (backend){
return kotobase.storage.core.validate_block_store_BANG_.call(null,backend,kotobase.storage.core.block_capabilities);
}));

(kotobase.storage.core.validate_block_store_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (backend,required){
if(kotobase.storage.core.block_backend_QMARK_.call(null,backend)){
} else {
throw cljs.core.ex_info.call(null,"Kotobase block store does not implement the storage contract",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("kotobase.storage","invalid-block-store","kotobase.storage/invalid-block-store",-898114627)], null));
}

var missing_542 = cljs.core.remove.call(null,kotobase.storage.core._capabilities.call(null,backend),required);
if(cljs.core.seq.call(null,missing_542)){
throw cljs.core.ex_info.call(null,"Kotobase block store lacks required capabilities",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("kotobase.storage","missing-capabilities","kotobase.storage/missing-capabilities",1549221631),new cljs.core.Keyword(null,"missing","missing",362507769),cljs.core.set.call(null,missing_542)], null));
} else {
}

var caps_543 = kotobase.storage.core._capabilities.call(null,backend);
if(cljs.core.truth_((function (){var and__5000__auto__ = caps_543.call(null,new cljs.core.Keyword(null,"packed-blocks","packed-blocks",248205991));
if(cljs.core.truth_(and__5000__auto__)){
return cljs.core.not.call(null,caps_543.call(null,new cljs.core.Keyword(null,"range-read","range-read",-74597338)));
} else {
return and__5000__auto__;
}
})())){
throw cljs.core.ex_info.call(null,"Kotobase block store declares :packed-blocks without :range-read",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("kotobase.storage","packed-without-range-read","kotobase.storage/packed-without-range-read",-818308558),new cljs.core.Keyword(null,"declared","declared",92336021),cljs.core.set.call(null,caps_543)], null));
} else {
}

return backend;
}));

(kotobase.storage.core.validate_block_store_BANG_.cljs$lang$maxFixedArity = 2);


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {kotobase.storage.core.IRefStore}
 * @implements {cljs.core.ICounted}
 * @implements {kotobase.storage.core.IBlockStore}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {kotobase.storage.core.IBackendCapabilities}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
kotobase.storage.core.ComposedBackend = (function (blocks,refs,__meta,__extmap,__hash){
this.blocks = blocks;
this.refs = refs;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(kotobase.storage.core.ComposedBackend.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5300__auto__,k__5301__auto__){
var self__ = this;
var this__5300__auto____$1 = this;
return this__5300__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5301__auto__,null);
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5302__auto__,k545,else__5303__auto__){
var self__ = this;
var this__5302__auto____$1 = this;
var G__549 = k545;
var G__549__$1 = (((G__549 instanceof cljs.core.Keyword))?G__549.fqn:null);
switch (G__549__$1) {
case "blocks":
return self__.blocks;

break;
case "refs":
return self__.refs;

break;
default:
return cljs.core.get.call(null,self__.__extmap,k545,else__5303__auto__);

}
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5320__auto__,f__5321__auto__,init__5322__auto__){
var self__ = this;
var this__5320__auto____$1 = this;
return cljs.core.reduce.call(null,(function (ret__5323__auto__,p__550){
var vec__551 = p__550;
var k__5324__auto__ = cljs.core.nth.call(null,vec__551,(0),null);
var v__5325__auto__ = cljs.core.nth.call(null,vec__551,(1),null);
return f__5321__auto__.call(null,ret__5323__auto__,k__5324__auto__,v__5325__auto__);
}),init__5322__auto__,this__5320__auto____$1);
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5315__auto__,writer__5316__auto__,opts__5317__auto__){
var self__ = this;
var this__5315__auto____$1 = this;
var pr_pair__5318__auto__ = (function (keyval__5319__auto__){
return cljs.core.pr_sequential_writer.call(null,writer__5316__auto__,cljs.core.pr_writer,""," ","",opts__5317__auto__,keyval__5319__auto__);
});
return cljs.core.pr_sequential_writer.call(null,writer__5316__auto__,pr_pair__5318__auto__,"#kotobase.storage.core.ComposedBackend{",", ","}",opts__5317__auto__,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"blocks","blocks",-610462153),self__.blocks],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"refs","refs",-1560051448),self__.refs],null))], null),self__.__extmap));
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__544){
var self__ = this;
var G__544__$1 = this;
return (new cljs.core.RecordIter((0),G__544__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"blocks","blocks",-610462153),new cljs.core.Keyword(null,"refs","refs",-1560051448)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator.call(null,self__.__extmap):cljs.core.nil_iter.call(null))));
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5298__auto__){
var self__ = this;
var this__5298__auto____$1 = this;
return self__.__meta;
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5295__auto__){
var self__ = this;
var this__5295__auto____$1 = this;
return (new kotobase.storage.core.ComposedBackend(self__.blocks,self__.refs,self__.__meta,self__.__extmap,self__.__hash));
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5304__auto__){
var self__ = this;
var this__5304__auto____$1 = this;
return (2 + cljs.core.count.call(null,self__.__extmap));
}));

(kotobase.storage.core.ComposedBackend.prototype.kotobase$storage$core$IBackendCapabilities$ = cljs.core.PROTOCOL_SENTINEL);

(kotobase.storage.core.ComposedBackend.prototype.kotobase$storage$core$IBackendCapabilities$_capabilities$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return cljs.core.into.call(null,cljs.core.set.call(null,cljs.core.remove.call(null,kotobase.storage.core.ref_profiles,kotobase.storage.core._capabilities.call(null,self__.blocks))),kotobase.storage.core._capabilities.call(null,self__.refs));
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5296__auto__){
var self__ = this;
var this__5296__auto____$1 = this;
var h__5111__auto__ = self__.__hash;
if((!((h__5111__auto__ == null)))){
return h__5111__auto__;
} else {
var h__5111__auto____$1 = (function (coll__5297__auto__){
return (1576553793 ^ cljs.core.hash_unordered_coll.call(null,coll__5297__auto__));
}).call(null,this__5296__auto____$1);
(self__.__hash = h__5111__auto____$1);

return h__5111__auto____$1;
}
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this546,other547){
var self__ = this;
var this546__$1 = this;
return (((!((other547 == null)))) && ((((this546__$1.constructor === other547.constructor)) && (((cljs.core._EQ_.call(null,this546__$1.blocks,other547.blocks)) && (((cljs.core._EQ_.call(null,this546__$1.refs,other547.refs)) && (cljs.core._EQ_.call(null,this546__$1.__extmap,other547.__extmap)))))))));
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5310__auto__,k__5311__auto__){
var self__ = this;
var this__5310__auto____$1 = this;
if(cljs.core.contains_QMARK_.call(null,new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"refs","refs",-1560051448),null,new cljs.core.Keyword(null,"blocks","blocks",-610462153),null], null), null),k__5311__auto__)){
return cljs.core.dissoc.call(null,cljs.core._with_meta.call(null,cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,this__5310__auto____$1),self__.__meta),k__5311__auto__);
} else {
return (new kotobase.storage.core.ComposedBackend(self__.blocks,self__.refs,self__.__meta,cljs.core.not_empty.call(null,cljs.core.dissoc.call(null,self__.__extmap,k__5311__auto__)),null));
}
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5307__auto__,k545){
var self__ = this;
var this__5307__auto____$1 = this;
var G__554 = k545;
var G__554__$1 = (((G__554 instanceof cljs.core.Keyword))?G__554.fqn:null);
switch (G__554__$1) {
case "blocks":
case "refs":
return true;

break;
default:
return cljs.core.contains_QMARK_.call(null,self__.__extmap,k545);

}
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5308__auto__,k__5309__auto__,G__544){
var self__ = this;
var this__5308__auto____$1 = this;
var pred__555 = cljs.core.keyword_identical_QMARK_;
var expr__556 = k__5309__auto__;
if(cljs.core.truth_(pred__555.call(null,new cljs.core.Keyword(null,"blocks","blocks",-610462153),expr__556))){
return (new kotobase.storage.core.ComposedBackend(G__544,self__.refs,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_(pred__555.call(null,new cljs.core.Keyword(null,"refs","refs",-1560051448),expr__556))){
return (new kotobase.storage.core.ComposedBackend(self__.blocks,G__544,self__.__meta,self__.__extmap,null));
} else {
return (new kotobase.storage.core.ComposedBackend(self__.blocks,self__.refs,self__.__meta,cljs.core.assoc.call(null,self__.__extmap,k__5309__auto__,G__544),null));
}
}
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5313__auto__){
var self__ = this;
var this__5313__auto____$1 = this;
return cljs.core.seq.call(null,cljs.core.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"blocks","blocks",-610462153),self__.blocks,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"refs","refs",-1560051448),self__.refs,null))], null),self__.__extmap));
}));

(kotobase.storage.core.ComposedBackend.prototype.kotobase$storage$core$IRefStore$ = cljs.core.PROTOCOL_SENTINEL);

(kotobase.storage.core.ComposedBackend.prototype.kotobase$storage$core$IRefStore$_read_ref$arity$2 = (function (_,ref_name){
var self__ = this;
var ___$1 = this;
return kotobase.storage.core._read_ref.call(null,self__.refs,ref_name);
}));

(kotobase.storage.core.ComposedBackend.prototype.kotobase$storage$core$IRefStore$_compare_and_set_ref_BANG_$arity$4 = (function (_,ref_name,expected,next){
var self__ = this;
var ___$1 = this;
return kotobase.storage.core._compare_and_set_ref_BANG_.call(null,self__.refs,ref_name,expected,next);
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5299__auto__,G__544){
var self__ = this;
var this__5299__auto____$1 = this;
return (new kotobase.storage.core.ComposedBackend(self__.blocks,self__.refs,G__544,self__.__extmap,self__.__hash));
}));

(kotobase.storage.core.ComposedBackend.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5305__auto__,entry__5306__auto__){
var self__ = this;
var this__5305__auto____$1 = this;
if(cljs.core.vector_QMARK_.call(null,entry__5306__auto__)){
return this__5305__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth.call(null,entry__5306__auto__,(0)),cljs.core._nth.call(null,entry__5306__auto__,(1)));
} else {
return cljs.core.reduce.call(null,cljs.core._conj,this__5305__auto____$1,entry__5306__auto__);
}
}));

(kotobase.storage.core.ComposedBackend.prototype.kotobase$storage$core$IBlockStore$ = cljs.core.PROTOCOL_SENTINEL);

(kotobase.storage.core.ComposedBackend.prototype.kotobase$storage$core$IBlockStore$_put_blocks_BANG_$arity$2 = (function (_,bs){
var self__ = this;
var ___$1 = this;
return kotobase.storage.core._put_blocks_BANG_.call(null,self__.blocks,bs);
}));

(kotobase.storage.core.ComposedBackend.prototype.kotobase$storage$core$IBlockStore$_get_blocks$arity$2 = (function (_,cids){
var self__ = this;
var ___$1 = this;
return kotobase.storage.core._get_blocks.call(null,self__.blocks,cids);
}));

(kotobase.storage.core.ComposedBackend.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"blocks","blocks",1030069374,null),new cljs.core.Symbol(null,"refs","refs",80480079,null)], null);
}));

(kotobase.storage.core.ComposedBackend.cljs$lang$type = true);

(kotobase.storage.core.ComposedBackend.cljs$lang$ctorPrSeq = (function (this__5346__auto__){
return (new cljs.core.List(null,"kotobase.storage.core/ComposedBackend",null,(1),null));
}));

(kotobase.storage.core.ComposedBackend.cljs$lang$ctorPrWriter = (function (this__5346__auto__,writer__5347__auto__){
return cljs.core._write.call(null,writer__5347__auto__,"kotobase.storage.core/ComposedBackend");
}));

/**
 * Positional factory function for kotobase.storage.core/ComposedBackend.
 */
kotobase.storage.core.__GT_ComposedBackend = (function kotobase$storage$core$__GT_ComposedBackend(blocks,refs){
return (new kotobase.storage.core.ComposedBackend(blocks,refs,null,null,null));
});

/**
 * Factory function for kotobase.storage.core/ComposedBackend, taking a map of keywords to field values.
 */
kotobase.storage.core.map__GT_ComposedBackend = (function kotobase$storage$core$map__GT_ComposedBackend(G__548){
var extmap__5342__auto__ = (function (){var G__558 = cljs.core.dissoc.call(null,G__548,new cljs.core.Keyword(null,"blocks","blocks",-610462153),new cljs.core.Keyword(null,"refs","refs",-1560051448));
if(cljs.core.record_QMARK_.call(null,G__548)){
return cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,G__558);
} else {
return G__558;
}
})();
return (new kotobase.storage.core.ComposedBackend(new cljs.core.Keyword(null,"blocks","blocks",-610462153).cljs$core$IFn$_invoke$arity$1(G__548),new cljs.core.Keyword(null,"refs","refs",-1560051448).cljs$core$IFn$_invoke$arity$1(G__548),null,cljs.core.not_empty.call(null,extmap__5342__auto__),null));
});

/**
 * A backend whose blocks and refs live on different providers.
 * 
 *   Blocks go to `blocks`, refs to `refs`, and the reported capabilities take
 *   the ref profile from `refs` alone. Each half is validated for its own role,
 *   so a block store without conditional writes is accepted for blocks and
 *   rejected for refs.
 */
kotobase.storage.core.compose = (function kotobase$storage$core$compose(p__561){
var map__562 = p__561;
var map__562__$1 = cljs.core.__destructure_map.call(null,map__562);
var blocks = cljs.core.get.call(null,map__562__$1,new cljs.core.Keyword(null,"blocks","blocks",-610462153));
var refs = cljs.core.get.call(null,map__562__$1,new cljs.core.Keyword(null,"refs","refs",-1560051448));
kotobase.storage.core.validate_block_store_BANG_.call(null,blocks);

if((function (){var and__5000__auto__ = kotobase.storage.core.ref_store_QMARK_.call(null,refs);
if(and__5000__auto__){
if((!((refs == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === refs.kotobase$storage$core$IBackendCapabilities$)))){
return true;
} else {
if((!refs.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_.call(null,kotobase.storage.core.IBackendCapabilities,refs);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_.call(null,kotobase.storage.core.IBackendCapabilities,refs);
}
} else {
return and__5000__auto__;
}
})()){
} else {
throw cljs.core.ex_info.call(null,"Kotobase ref store does not implement the storage contract",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("kotobase.storage","invalid-ref-store","kotobase.storage/invalid-ref-store",-329072859)], null));
}

if(cljs.core.truth_(kotobase.storage.core.ref_profile.call(null,refs))){
} else {
throw cljs.core.ex_info.call(null,"Kotobase ref store must declare exactly one ref profile",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("kotobase.storage","undeclared-ref-profile","kotobase.storage/undeclared-ref-profile",-1274699413),new cljs.core.Keyword(null,"expected","expected",1583670997),kotobase.storage.core.ref_profiles], null));
}

return kotobase.storage.core.__GT_ComposedBackend.call(null,blocks,refs);
});
kotobase.storage.core.put_block_BANG_ = (function kotobase$storage$core$put_block_BANG_(store,cid,bytes){
return kotobase.storage.core._put_blocks_BANG_.call(null,store,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"cid","cid",-1940591320),cid,new cljs.core.Keyword(null,"bytes","bytes",1175866680),bytes], null)], null));
});
kotobase.storage.core.get_block = (function kotobase$storage$core$get_block(store,cid){
return cljs.core.get.call(null,kotobase.storage.core._get_blocks.call(null,store,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cid], null)),cid);
});
/**
 * Return the stable mutable-ref name for a tenant/database pair.
 * 
 *   Blocks remain globally CID-addressed; only mutable refs require logical
 *   scoping. `pr-str` is deliberately used as an unambiguous CLJ/CLJS encoding.
 */
kotobase.storage.core.scoped_ref = (function kotobase$storage$core$scoped_ref(tenant,database){
return cljs.core.pr_str.call(null,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("kotobase","ref","kotobase/ref",1689261623),tenant,database], null));
});
/**
 * Expose synchronous kotobase-engine function ports for a JVM backend.
 */
kotobase.storage.core.ports = (function kotobase$storage$core$ports(store){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"put!","put!",2123215223),(function (cid,bytes){
return kotobase.storage.core.put_block_BANG_.call(null,store,cid,bytes);
}),new cljs.core.Keyword(null,"get-fn","get-fn",413483335),(function (cid){
return kotobase.storage.core.get_block.call(null,store,cid);
}),new cljs.core.Keyword(null,"head","head",-771383919),(function (name){
var G__564 = kotobase.storage.core._read_ref.call(null,store,name);
if((G__564 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"cid","cid",-1940591320).cljs$core$IFn$_invoke$arity$1(G__564);
}
}),new cljs.core.Keyword(null,"cas!","cas!",-1922272561),(function (name,expected,next){
return new cljs.core.Keyword(null,"current","current",-1088038603).cljs$core$IFn$_invoke$arity$1(kotobase.storage.core._compare_and_set_ref_BANG_.call(null,store,name,expected,next));
})], null);
});
/**
 * Expose Promise-returning kotobase-engine ports for a Worker backend.
 */
kotobase.storage.core.async_ports = (function kotobase$storage$core$async_ports(store){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"put!","put!",2123215223),(function (cid,bytes){
return kotobase.storage.core.put_block_BANG_.call(null,store,cid,bytes);
}),new cljs.core.Keyword(null,"get-fn","get-fn",413483335),(function (cid){
return kotobase.storage.core._get_blocks.call(null,store,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [cid], null)).then((function (p1__565_SHARP_){
return cljs.core.get.call(null,p1__565_SHARP_,cid);
}));
}),new cljs.core.Keyword(null,"head","head",-771383919),(function (name){
return kotobase.storage.core._read_ref.call(null,store,name).then((function (p1__566_SHARP_){
var G__567 = p1__566_SHARP_;
if((G__567 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"cid","cid",-1940591320).cljs$core$IFn$_invoke$arity$1(G__567);
}
}));
}),new cljs.core.Keyword(null,"cas!","cas!",-1922272561),(function (name,expected,next){
return kotobase.storage.core._compare_and_set_ref_BANG_.call(null,store,name,expected,next).then((function (result){
return new cljs.core.Keyword(null,"current","current",-1088038603).cljs$core$IFn$_invoke$arity$1(result);
}));
})], null);
});

//# sourceMappingURL=core.js.map
