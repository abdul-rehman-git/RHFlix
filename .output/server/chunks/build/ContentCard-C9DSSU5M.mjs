import { u as useTmdb, d as useMyList, a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, toDisplayString, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderTeleport, ssrInterpolate, ssrRenderAttr, ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { u as useMediaRelease } from './useMediaRelease-BR9XhcFs.mjs';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TrailerModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    videoKey: {},
    title: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"><div class="relative w-full max-w-4xl bg-marxi-950 rounded-2xl sm:rounded-3xl border border-marxi-800 shadow-2xl overflow-hidden flex flex-col"><div class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-marxi-800/80 bg-marxi-900/60"><div class="flex items-center space-x-2.5 min-w-0 pr-4"><div class="w-2 h-2 rounded-full bg-marxi-accent animate-pulse"></div><h3 class="font-display font-bold text-sm sm:text-lg text-white truncate">${ssrInterpolate(__props.title ? `Trailer: ${__props.title}` : "Official Trailer")}</h3></div><button class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-marxi-850 hover:bg-marxi-800 text-gray-300 hover:text-white border border-marxi-700 flex items-center justify-center transition-colors shrink-0 shadow-md min-h-[36px] min-w-[36px]" aria-label="Close Trailer"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="relative w-full aspect-video bg-black overflow-hidden">`);
          if (__props.videoKey) {
            _push2(`<iframe${ssrRenderAttr("src", `https://www.youtube-nocookie.com/embed/${__props.videoKey}?autoplay=1&rel=0`)} title="Official Trailer" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
          } else {
            _push2(`<div class="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><p class="text-sm font-medium">Trailer video unavailable for this title.</p></div>`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TrailerModal.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ComingSoonModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    item: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { getImageUrl } = useTmdb();
    const { formatReleaseDate } = useMediaRelease();
    const { isInList } = useMyList();
    const isTrailerOpen = ref(false);
    const trailerKey = ref(null);
    const isMovie = computed(() => {
      if (!props.item) return true;
      return Boolean(props.item.title || props.item.media_type === "movie");
    });
    const detailsUrl = computed(() => {
      if (!props.item) return "/";
      return isMovie.value ? `/movie/${props.item.id}` : `/tv/${props.item.id}`;
    });
    const inList = computed(() => {
      if (!props.item) return false;
      return isInList(props.item.id, isMovie.value ? "movie" : "tv");
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_TrailerModal = _sfc_main$2;
      _push(`<!--[-->`);
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen && __props.item) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"><div class="relative w-full max-w-lg bg-marxi-950 rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col animate-scaleUp"><div class="relative h-44 sm:h-52 w-full overflow-hidden bg-marxi-900">`);
          if (__props.item.backdrop_path || __props.item.poster_path) {
            _push2(`<img${ssrRenderAttr("src", unref(getImageUrl)(__props.item.backdrop_path || __props.item.poster_path, "original"))}${ssrRenderAttr("alt", __props.item.title || __props.item.name || "Backdrop")} class="w-full h-full object-cover opacity-35 filter blur-xs scale-105">`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="absolute inset-0 bg-gradient-to-t from-marxi-950 via-marxi-950/70 to-transparent"></div><button class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-gray-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors z-20" aria-label="Close"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button><div class="absolute bottom-3 left-4 right-4 flex items-end space-x-3.5 z-10"><div class="w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-xl shrink-0 bg-marxi-850"><img${ssrRenderAttr("src", unref(getImageUrl)(__props.item.poster_path, "w342"))}${ssrRenderAttr("alt", __props.item.title || __props.item.name || "Poster")} class="w-full h-full object-cover"></div><div class="min-w-0 flex-1 pb-1"><span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-[10px] uppercase tracking-wider shadow-md mb-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg><span>Coming Soon \u2022 Not Released</span></span><h3 class="font-display font-black text-base sm:text-xl text-white truncate leading-snug">${ssrInterpolate(__props.item.title || __props.item.name)}</h3><p class="text-xs text-amber-400 font-semibold mt-0.5 flex items-center space-x-1"><span>\u{1F5D3}\uFE0F Expected:</span><span>${ssrInterpolate(unref(formatReleaseDate)(__props.item))}</span></p></div></div></div><div class="p-4 sm:p-6 space-y-4"><div class="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3"><div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="space-y-1 text-left text-xs"><p class="font-bold text-white text-xs sm:text-sm"> Yeh title abhi release nahi hua (Not Yet Available) </p><p class="text-gray-300 leading-relaxed text-[11px] sm:text-xs"> Streaming servers par yeh movie abhi available nahi hai. Jaise hi officially online release hogi, RHFlix par full HD streaming unlock ho jayegi. </p></div></div>`);
          if (__props.item.overview) {
            _push2(`<p class="text-xs text-gray-400 line-clamp-3 leading-relaxed">${ssrInterpolate(__props.item.overview)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="pt-2 space-y-2.5"><button class="w-full py-3 px-4 bg-marxi-gold hover:bg-amber-400 text-black font-black text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all min-h-[44px]"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg><span>Watch Official Trailer</span></button><div class="grid grid-cols-2 gap-2"><button class="py-2.5 px-3 bg-marxi-850 hover:bg-marxi-800 text-white font-bold text-xs rounded-xl border border-marxi-700 flex items-center justify-center space-x-1.5 transition-colors min-h-[42px]">`);
          if (!unref(inList)) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`);
          } else {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-marxi-accent fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`);
          }
          _push2(`<span>${ssrInterpolate(unref(inList) ? "In Watchlist" : "Add to List")}</span></button>`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: unref(detailsUrl),
            onClick: ($event) => emit("close"),
            class: "py-2.5 px-3 bg-marxi-800 hover:bg-marxi-700 text-gray-200 hover:text-white font-bold text-xs rounded-xl border border-white/10 flex items-center justify-center space-x-1.5 transition-colors min-h-[42px]"
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><span${_scopeId}>View Details</span>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: "h-4 w-4",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "2",
                      d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    })
                  ])),
                  createVNode("span", null, "View Details")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`</div></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(ssrRenderComponent(_component_TrailerModal, {
        isOpen: unref(isTrailerOpen),
        videoKey: unref(trailerKey),
        title: ((_a = __props.item) == null ? void 0 : _a.title) || ((_b = __props.item) == null ? void 0 : _b.name),
        onClose: ($event) => isTrailerOpen.value = false
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ComingSoonModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ContentCard",
  __ssrInlineRender: true,
  props: {
    item: {},
    historyText: {},
    isGrid: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const { getImageUrl } = useTmdb();
    const { isInList, toggleMyList } = useMyList();
    const { isComingSoon } = useMediaRelease();
    const isComingSoonModalOpen = ref(false);
    const isMovie = computed(() => Boolean(props.item.title || props.item.media_type === "movie"));
    const isUnreleased = computed(() => isComingSoon(props.item));
    const releaseYear = computed(() => {
      const dateStr = props.item.release_date || props.item.first_air_date;
      return dateStr ? dateStr.substring(0, 4) : "";
    });
    const detailUrl = computed(() => {
      return isMovie.value ? `/movie/${props.item.id}` : `/tv/${props.item.id}`;
    });
    const inList = computed(() => {
      return isInList(props.item.id, isMovie.value ? "movie" : "tv");
    });
    const handleCardClick = (e) => {
      if (isUnreleased.value) {
        e.preventDefault();
        e.stopPropagation();
        isComingSoonModalOpen.value = true;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ComingSoonModal = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["group relative bg-marxi-850 rounded-2xl overflow-hidden shadow-md hover:shadow-glow-card border border-marxi-800/60 hover:border-marxi-700 transition-all duration-300 transform hover:-translate-y-1.5", [__props.isGrid ? "w-full" : "flex-none w-[125px] sm:w-48 lg:w-56 snap-start"]]
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(detailUrl),
        onClick: handleCardClick,
        class: "block relative aspect-[2/3] w-full overflow-hidden bg-marxi-800 cursor-pointer"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(getImageUrl)(__props.item.poster_path, "w500"))}${ssrRenderAttr("alt", __props.item.title || __props.item.name || "Poster")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" loading="lazy"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-marxi-950 via-marxi-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"${_scopeId}></div><div class="absolute top-2 left-2 right-2 flex items-center justify-between z-10"${_scopeId}><div class="flex items-center space-x-1"${_scopeId}>`);
            if (unref(isUnreleased)) {
              _push2(`<span class="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase rounded bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md border border-amber-300/40 flex items-center space-x-0.5"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5 fill-current" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"${_scopeId}></path></svg><span${_scopeId}>Coming Soon</span></span>`);
            } else {
              _push2(`<span class="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase rounded bg-marxi-950/80 backdrop-blur-md text-gray-200 border border-white/10"${_scopeId}>${ssrInterpolate(unref(isMovie) ? "Movie" : "TV")}</span>`);
            }
            if (__props.item.adult) {
              _push2(`<span class="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase rounded bg-red-600/90 text-white border border-red-400/40 shadow-glow-red"${_scopeId}> 18+ </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (__props.item.vote_average && __props.item.vote_average > 0) {
              _push2(`<div class="flex items-center space-x-0.5 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold rounded bg-black/75 backdrop-blur-md text-marxi-gold border border-white/10"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-current" viewBox="0 0 20 20"${_scopeId}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(__props.item.vote_average.toFixed(1))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"${_scopeId}>`);
            if (!unref(isUnreleased)) {
              _push2(`<div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-marxi-accent text-white flex items-center justify-center shadow-glow-red transform scale-75 group-hover:scale-100 transition-transform duration-300"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"${_scopeId}></path></svg></div>`);
            } else {
              _push2(`<div class="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold border border-amber-300 shadow-xl flex items-center space-x-1.5 transform scale-90 group-hover:scale-100 transition-transform duration-300"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"${_scopeId}></path></svg><span class="text-[10px] sm:text-xs tracking-tight"${_scopeId}>Coming Soon</span></div>`);
            }
            _push2(`</div><button class="absolute bottom-1.5 right-1.5 p-2.5 rounded-full bg-marxi-950/80 backdrop-blur-md text-gray-300 hover:text-white border border-white/10 z-10 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"${ssrRenderAttr("title", unref(inList) ? "Remove from My List" : "Add to My List")} aria-label="Toggle My List"${_scopeId}>`);
            if (!unref(inList)) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"${_scopeId}></path></svg>`);
            } else {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-marxi-accent fill-current" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"${_scopeId}></path></svg>`);
            }
            _push2(`</button>`);
          } else {
            return [
              createVNode("img", {
                src: unref(getImageUrl)(__props.item.poster_path, "w500"),
                alt: __props.item.title || __props.item.name || "Poster",
                class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out",
                loading: "lazy"
              }, null, 8, ["src", "alt"]),
              createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-marxi-950 via-marxi-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" }),
              createVNode("div", { class: "absolute top-2 left-2 right-2 flex items-center justify-between z-10" }, [
                createVNode("div", { class: "flex items-center space-x-1" }, [
                  unref(isUnreleased) ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase rounded bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md border border-amber-300/40 flex items-center space-x-0.5"
                  }, [
                    (openBlock(), createBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      class: "h-2.5 w-2.5 fill-current",
                      viewBox: "0 0 20 20"
                    }, [
                      createVNode("path", {
                        "fill-rule": "evenodd",
                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z",
                        "clip-rule": "evenodd"
                      })
                    ])),
                    createVNode("span", null, "Coming Soon")
                  ])) : (openBlock(), createBlock("span", {
                    key: 1,
                    class: "px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase rounded bg-marxi-950/80 backdrop-blur-md text-gray-200 border border-white/10"
                  }, toDisplayString(unref(isMovie) ? "Movie" : "TV"), 1)),
                  __props.item.adult ? (openBlock(), createBlock("span", {
                    key: 2,
                    class: "px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wider uppercase rounded bg-red-600/90 text-white border border-red-400/40 shadow-glow-red"
                  }, " 18+ ")) : createCommentVNode("", true)
                ]),
                __props.item.vote_average && __props.item.vote_average > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "flex items-center space-x-0.5 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold rounded bg-black/75 backdrop-blur-md text-marxi-gold border border-white/10"
                }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: "h-3 w-3 fill-current",
                    viewBox: "0 0 20 20"
                  }, [
                    createVNode("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
                  ])),
                  createVNode("span", null, toDisplayString(__props.item.vote_average.toFixed(1)), 1)
                ])) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" }, [
                !unref(isUnreleased) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-marxi-accent text-white flex items-center justify-center shadow-glow-red transform scale-75 group-hover:scale-100 transition-transform duration-300"
                }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: "h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5",
                    viewBox: "0 0 20 20"
                  }, [
                    createVNode("path", {
                      "fill-rule": "evenodd",
                      d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z",
                      "clip-rule": "evenodd"
                    })
                  ]))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold border border-amber-300 shadow-xl flex items-center space-x-1.5 transform scale-90 group-hover:scale-100 transition-transform duration-300"
                }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: "h-3.5 w-3.5 fill-current",
                    viewBox: "0 0 20 20"
                  }, [
                    createVNode("path", {
                      "fill-rule": "evenodd",
                      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z",
                      "clip-rule": "evenodd"
                    })
                  ])),
                  createVNode("span", { class: "text-[10px] sm:text-xs tracking-tight" }, "Coming Soon")
                ]))
              ]),
              createVNode("button", {
                onClick: withModifiers(($event) => unref(toggleMyList)(__props.item), ["prevent"]),
                class: "absolute bottom-1.5 right-1.5 p-2.5 rounded-full bg-marxi-950/80 backdrop-blur-md text-gray-300 hover:text-white border border-white/10 z-10 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center",
                title: unref(inList) ? "Remove from My List" : "Add to My List",
                "aria-label": "Toggle My List"
              }, [
                !unref(inList) ? (openBlock(), createBlock("svg", {
                  key: 0,
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-4 w-4",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  stroke: "currentColor"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M12 4v16m8-8H4"
                  })
                ])) : (openBlock(), createBlock("svg", {
                  key: 1,
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-4 w-4 text-marxi-accent fill-current",
                  viewBox: "0 0 20 20"
                }, [
                  createVNode("path", {
                    "fill-rule": "evenodd",
                    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                    "clip-rule": "evenodd"
                  })
                ]))
              ], 8, ["onClick", "title"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="p-2.5 sm:p-3.5 space-y-0.5 sm:space-y-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(detailUrl),
        onClick: handleCardClick,
        class: "block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="font-bold text-xs sm:text-sm text-white truncate group-hover:text-marxi-accent transition-colors"${_scopeId}>${ssrInterpolate(__props.item.title || __props.item.name)}</h3>`);
          } else {
            return [
              createVNode("h3", { class: "font-bold text-xs sm:text-sm text-white truncate group-hover:text-marxi-accent transition-colors" }, toDisplayString(__props.item.title || __props.item.name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center justify-between text-[11px] sm:text-xs text-gray-400">`);
      if (unref(isUnreleased)) {
        _push(`<span class="text-amber-400 font-semibold text-[10px] sm:text-[11px] flex items-center space-x-1"><span>Coming ${ssrInterpolate(unref(releaseYear) ? unref(releaseYear) : "Soon")}</span></span>`);
      } else {
        _push(`<span>${ssrInterpolate(unref(releaseYear))}</span>`);
      }
      if (__props.historyText) {
        _push(`<span class="text-marxi-accent text-[10px] sm:text-[11px] font-semibold truncate max-w-[80px]">${ssrInterpolate(__props.historyText)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(_component_ComingSoonModal, {
        isOpen: unref(isComingSoonModalOpen),
        item: __props.item,
        onClose: ($event) => isComingSoonModalOpen.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContentCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$2 as _, _sfc_main as a, _sfc_main$1 as b };
//# sourceMappingURL=ContentCard-C9DSSU5M.mjs.map
