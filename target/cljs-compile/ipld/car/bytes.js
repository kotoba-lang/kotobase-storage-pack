// Compiled by ClojureScript 1.11.132 {:target :nodejs, :nodejs-rt true, :optimizations :none}
goog.provide('ipld.car.bytes');
goog.require('cljs.core');
ipld.car.bytes.max_safe_integer = (9007199254740991);
/**
 * Is `x` already this runtime's byte container?
 */
ipld.car.bytes.native_QMARK_ = (function ipld$car$bytes$native_QMARK_(x){
return (x instanceof Uint8Array);
});
/**
 * A seq of unsigned byte values → the runtime's byte container.
 */
ipld.car.bytes.__GT_bytes = (function ipld$car$bytes$__GT_bytes(xs){
return (new Uint8Array(cljs.core.into_array.call(null,xs)));
});
/**
 * Normalise foreign byte representations.
 * 
 *   This exists because the sibling libraries are not uniform: on the JVM
 *   `multiformats.base32/decode` returns a `byte[]`, and on ClojureScript it
 *   returns a Clojure vector of numbers. Both are correct for their callers and
 *   neither is wrong, but a byte format cannot be written against two shapes —
 *   `.length` on a vector is `undefined`, which silently allocates a zero-length
 *   buffer instead of failing. Everything entering this namespace is normalised
 *   once, here, rather than by a convention each call site is expected to
 *   remember.
 */
ipld.car.bytes.as_bytes = (function ipld$car$bytes$as_bytes(x){
if(ipld.car.bytes.native_QMARK_.call(null,x)){
return x;
} else {
if(((cljs.core.sequential_QMARK_.call(null,x)) || (cljs.core.seq_QMARK_.call(null,x)))){
return ipld.car.bytes.__GT_bytes.call(null,x);
} else {
if(cljs.core.array_QMARK_.call(null,x)){
return (new Uint8Array(x));
} else {
throw cljs.core.ex_info.call(null,"car: not a byte container",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("car","not-bytes","car/not-bytes",-1220189882),new cljs.core.Keyword(null,"value-type","value-type",576005757),cljs.core.type.call(null,x)], null));

}
}
}
});
ipld.car.bytes.bcount = (function ipld$car$bytes$bcount(b){
if(ipld.car.bytes.native_QMARK_.call(null,b)){
return b.length;
} else {
return cljs.core.count.call(null,b);
}
});
/**
 * The unsigned value of byte `i`. JVM bytes are signed; this is the only
 *   correct way to read one as a number on both runtimes.
 */
ipld.car.bytes.bget = (function ipld$car$bytes$bget(b,i){
if(ipld.car.bytes.native_QMARK_.call(null,b)){
return (b[i]);
} else {
return (cljs.core.nth.call(null,b,i) & (255));
}
});
/**
 * Concatenate byte containers into one.
 */
ipld.car.bytes.concat = (function ipld$car$bytes$concat(parts_STAR_){
var parts = cljs.core.map.call(null,ipld.car.bytes.as_bytes,parts_STAR_);
var total = cljs.core.reduce.call(null,cljs.core._PLUS_,(0),cljs.core.map.call(null,ipld.car.bytes.bcount,parts));
var out = (new Uint8Array(total));
var ps = parts;
var off = (0);
while(true){
var temp__5823__auto__ = cljs.core.first.call(null,ps);
if(cljs.core.truth_(temp__5823__auto__)){
var p = temp__5823__auto__;
out.set(p,off);

var G__570 = cljs.core.rest.call(null,ps);
var G__571 = (off + ipld.car.bytes.bcount.call(null,p));
ps = G__570;
off = G__571;
continue;
} else {
return out;
}
break;
}
});
/**
 * Bytes `[start, end)` as a new container.
 */
ipld.car.bytes.slice = (function ipld$car$bytes$slice(b_STAR_,start,end){
var b = ipld.car.bytes.as_bytes.call(null,b_STAR_);
if((((start < (0))) || ((((end < start)) || ((end > ipld.car.bytes.bcount.call(null,b))))))){
throw cljs.core.ex_info.call(null,"car: slice out of range",new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("car","slice-out-of-range","car/slice-out-of-range",-1937048065),new cljs.core.Keyword(null,"start","start",-355208981),start,new cljs.core.Keyword(null,"end","end",-268185958),end,new cljs.core.Keyword(null,"size","size",1098693007),ipld.car.bytes.bcount.call(null,b)], null));
} else {
}

return b.slice(start,end);
});
ipld.car.bytes.equal_QMARK_ = (function ipld$car$bytes$equal_QMARK_(a,b){
return ((cljs.core._EQ_.call(null,ipld.car.bytes.bcount.call(null,a),ipld.car.bytes.bcount.call(null,b))) && (cljs.core.every_QMARK_.call(null,(function (p1__572_SHARP_){
return cljs.core._EQ_.call(null,ipld.car.bytes.bget.call(null,a,p1__572_SHARP_),ipld.car.bytes.bget.call(null,b,p1__572_SHARP_));
}),cljs.core.range.call(null,ipld.car.bytes.bcount.call(null,a)))));
});
ipld.car.bytes.u32_le = (function ipld$car$bytes$u32_le(n){
if((((n < (0))) || ((n > (4294967295))))){
throw cljs.core.ex_info.call(null,"car: uint32 out of range",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("car","uint-range","car/uint-range",-1969317906),new cljs.core.Keyword(null,"value","value",305978217),n], null));
} else {
}

return ipld.car.bytes.__GT_bytes.call(null,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(n & (255)),((n >>> (8)) & (255)),((n >>> (16)) & (255)),((n >>> (24)) & (255))], null));
});
ipld.car.bytes.read_u32_le = (function ipld$car$bytes$read_u32_le(b,off){
return (((ipld.car.bytes.bget.call(null,b,off) + ((256) * ipld.car.bytes.bget.call(null,b,(off + (1))))) + ((65536) * ipld.car.bytes.bget.call(null,b,(off + (2))))) + ((16777216) * ipld.car.bytes.bget.call(null,b,(off + (3)))));
});
/**
 * Eight little-endian bytes. Refuses values above 2^53-1: the CAR format
 *   permits them, but a JavaScript host cannot hold one exactly, so encoding it
 *   here would produce a file whose offsets differ by runtime.
 */
ipld.car.bytes.u64_le = (function ipld$car$bytes$u64_le(n){
if((((n < (0))) || ((n > (9007199254740991))))){
throw cljs.core.ex_info.call(null,"car: uint64 outside the exactly-representable range",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("car","uint64-not-exact","car/uint64-not-exact",1242269948),new cljs.core.Keyword(null,"value","value",305978217),n,new cljs.core.Keyword(null,"limit","limit",-1355822363),(9007199254740991)], null));
} else {
}

var lo = cljs.core.mod.call(null,n,(4294967296));
var hi = cljs.core.long$.call(null,((n - lo) / (4294967296)));
return ipld.car.bytes.concat.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [ipld.car.bytes.u32_le.call(null,lo),ipld.car.bytes.u32_le.call(null,hi)], null));
});
ipld.car.bytes.read_u64_le = (function ipld$car$bytes$read_u64_le(b,off){
var lo = ipld.car.bytes.read_u32_le.call(null,b,off);
var hi = ipld.car.bytes.read_u32_le.call(null,b,(off + (4)));
var v = (lo + (hi * (4294967296)));
if((v > (9007199254740991))){
throw cljs.core.ex_info.call(null,"car: uint64 in file exceeds the exactly-representable range",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("car","uint64-not-exact","car/uint64-not-exact",1242269948),new cljs.core.Keyword(null,"offset","offset",296498311),off], null));
} else {
}

return v;
});
/**
 * Unsigned LEB128 bytes for `n`.
 */
ipld.car.bytes.varint = (function ipld$car$bytes$varint(n){
if((n < (0))){
throw cljs.core.ex_info.call(null,"car: varint is unsigned",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("car","varint-negative","car/varint-negative",1981078651),new cljs.core.Keyword(null,"value","value",305978217),n], null));
} else {
}

var v = n;
var out = cljs.core.PersistentVector.EMPTY;
while(true){
if((v < (128))){
return ipld.car.bytes.__GT_bytes.call(null,cljs.core.conj.call(null,out,v));
} else {
var G__573 = (v >>> (7));
var G__574 = cljs.core.conj.call(null,out,((v & (127)) | (128)));
v = G__573;
out = G__574;
continue;
}
break;
}
});
/**
 * Read an unsigned LEB128 at `off`. Returns `{:value n :length bytes-read}`.
 * 
 *   Bounded at nine continuation bytes: an unterminated varint in a truncated or
 *   hostile file must fail rather than walk the buffer.
 */
ipld.car.bytes.read_varint = (function ipld$car$bytes$read_varint(b,off){
var i = off;
var shift = (0);
var acc = (0);
while(true){
if((i >= ipld.car.bytes.bcount.call(null,b))){
throw cljs.core.ex_info.call(null,"car: varint runs past end of buffer",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("car","varint-truncated","car/varint-truncated",1991374939),new cljs.core.Keyword(null,"offset","offset",296498311),off], null));
} else {
}

if((shift > (63))){
throw cljs.core.ex_info.call(null,"car: varint too long",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("car","varint-too-long","car/varint-too-long",2066477092),new cljs.core.Keyword(null,"offset","offset",296498311),off], null));
} else {
}

var byte_v = ipld.car.bytes.bget.call(null,b,i);
var acc_SINGLEQUOTE_ = (acc + ((byte_v & (127)) * Math.pow((2),shift)));
if(((byte_v & (128)) === (0))){
if((acc_SINGLEQUOTE_ > (9007199254740991))){
throw cljs.core.ex_info.call(null,"car: varint outside the exactly-representable range",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword("car","uint64-not-exact","car/uint64-not-exact",1242269948),new cljs.core.Keyword(null,"offset","offset",296498311),off], null));
} else {
}

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),cljs.core.long$.call(null,acc_SINGLEQUOTE_),new cljs.core.Keyword(null,"length","length",588987862),((i - off) + (1))], null);
} else {
var G__575 = (i + (1));
var G__576 = (shift + (7));
var G__577 = acc_SINGLEQUOTE_;
i = G__575;
shift = G__576;
acc = G__577;
continue;
}
break;
}
});

//# sourceMappingURL=bytes.js.map
