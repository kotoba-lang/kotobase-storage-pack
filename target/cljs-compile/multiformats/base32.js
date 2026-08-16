// Compiled by ClojureScript 1.11.132 {:target :nodejs, :nodejs-rt true, :optimizations :none}
goog.provide('multiformats.base32');
goog.require('cljs.core');
multiformats.base32.alphabet = "abcdefghijklmnopqrstuvwxyz234567";
multiformats.base32.alphabet_index = cljs.core.into.call(null,cljs.core.PersistentArrayMap.EMPTY,cljs.core.map_indexed.call(null,(function (i,c){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [c,i], null);
}),multiformats.base32.alphabet));
multiformats.base32.alphabet_char = (function multiformats$base32$alphabet_char(i){
return multiformats.base32.alphabet.charAt(i);
});
/**
 * Bytes to lowercase RFC 4648 base32 without padding.
 */
multiformats.base32.encode = (function multiformats$base32$encode(bytes){
var bits = cljs.core.mapcat.call(null,(function (byte$){
var v = ((byte$ | (0)) & (255));
return cljs.core.map.call(null,(function (p1__526_SHARP_){
return ((v >> p1__526_SHARP_) & (1));
}),new cljs.core.PersistentVector(null, 8, 5, cljs.core.PersistentVector.EMPTY_NODE, [(7),(6),(5),(4),(3),(2),(1),(0)], null));
}),cljs.core.seq.call(null,bytes));
return cljs.core.apply.call(null,cljs.core.str,cljs.core.map.call(null,(function (chunk){
var padded = cljs.core.concat.call(null,chunk,cljs.core.repeat.call(null,((5) - cljs.core.count.call(null,chunk)),(0)));
return multiformats.base32.alphabet_char.call(null,cljs.core.reduce.call(null,(function (acc,bit){
return ((acc * (2)) + bit);
}),(0),padded));
}),cljs.core.partition.call(null,(5),(5),null,bits)));
});
/**
 * Lowercase RFC 4648 base32 without padding to bytes; reject bad input.
 */
multiformats.base32.decode = (function multiformats$base32$decode(text){
var out = (function (){var chars = cljs.core.seq.call(null,text);
var buffer = (0);
var bit_count = (0);
var acc = cljs.core.PersistentVector.EMPTY;
while(true){
if(cljs.core.empty_QMARK_.call(null,chars)){
return acc;
} else {
var ch = cljs.core.first.call(null,chars);
var idx = (function (){var or__5002__auto__ = multiformats.base32.alphabet_index.call(null,ch);
if(cljs.core.truth_(or__5002__auto__)){
return or__5002__auto__;
} else {
throw cljs.core.ex_info.call(null,"multiformats: invalid base32 character",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"char","char",-641587586),ch], null));
}
})();
var buffer__$1 = ((buffer << (5)) | idx);
var bit_count__$1 = (bit_count + (5));
if((bit_count__$1 >= (8))){
var G__527 = cljs.core.rest.call(null,chars);
var G__528 = buffer__$1;
var G__529 = (bit_count__$1 - (8));
var G__530 = cljs.core.conj.call(null,acc,((buffer__$1 >>> (bit_count__$1 - (8))) & (255)));
chars = G__527;
buffer = G__528;
bit_count = G__529;
acc = G__530;
continue;
} else {
var G__531 = cljs.core.rest.call(null,chars);
var G__532 = buffer__$1;
var G__533 = bit_count__$1;
var G__534 = acc;
chars = G__531;
buffer = G__532;
bit_count = G__533;
acc = G__534;
continue;
}
}
break;
}
})();
return cljs.core.vec.call(null,out);
});

//# sourceMappingURL=base32.js.map
