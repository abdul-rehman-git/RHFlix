import { u as useTmdb, d as useMyList, a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';

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
    const isMovie = computed(() => Boolean(props.item.title || props.item.media_type === "movie"));
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
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["group relative bg-marxi-850 rounded-2xl overflow-hidden shadow-md hover:shadow-glow-card border border-marxi-800/60 hover:border-marxi-700 transition-all duration-300 transform hover:-translate-y-1.5", [__props.isGrid ? "w-full" : "flex-none w-[125px] sm:w-48 lg:w-56 snap-start"]]
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: unref(detailUrl),
        class: "block relative aspect-[2/3] w-full overflow-hidden bg-marxi-800"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", unref(getImageUrl)(__props.item.poster_path, "w500"))}${ssrRenderAttr("alt", __props.item.title || __props.item.name || "Poster")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" loading="lazy"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-marxi-950 via-marxi-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"${_scopeId}></div><div class="absolute top-2 left-2 right-2 flex items-center justify-between z-10"${_scopeId}><span class="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase rounded bg-marxi-950/80 backdrop-blur-md text-gray-200 border border-white/10"${_scopeId}>${ssrInterpolate(unref(isMovie) ? "Movie" : "TV")}</span>`);
            if (__props.item.vote_average) {
              _push2(`<div class="flex items-center space-x-0.5 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold rounded bg-black/75 backdrop-blur-md text-marxi-gold border border-white/10"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-current" viewBox="0 0 20 20"${_scopeId}><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(__props.item.vote_average.toFixed(1))}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"${_scopeId}><div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-marxi-accent text-white flex items-center justify-center shadow-glow-red transform scale-75 group-hover:scale-100 transition-transform duration-300"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"${_scopeId}></path></svg></div></div><button class="absolute bottom-1.5 right-1.5 p-2.5 rounded-full bg-marxi-950/80 backdrop-blur-md text-gray-300 hover:text-white border border-white/10 z-10 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"${ssrRenderAttr("title", unref(inList) ? "Remove from My List" : "Add to My List")} aria-label="Toggle My List"${_scopeId}>`);
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
                createVNode("span", { class: "px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider uppercase rounded bg-marxi-950/80 backdrop-blur-md text-gray-200 border border-white/10" }, toDisplayString(unref(isMovie) ? "Movie" : "TV"), 1),
                __props.item.vote_average ? (openBlock(), createBlock("div", {
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
                createVNode("div", { class: "w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-marxi-accent text-white flex items-center justify-center shadow-glow-red transform scale-75 group-hover:scale-100 transition-transform duration-300" }, [
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
                ])
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
      _push(`<div class="flex items-center justify-between text-[11px] sm:text-xs text-gray-400"><span>${ssrInterpolate(unref(releaseYear))}</span>`);
      if (__props.historyText) {
        _push(`<span class="text-marxi-accent text-[10px] sm:text-[11px] font-semibold truncate max-w-[80px]">${ssrInterpolate(__props.historyText)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContentCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ContentCard-BrOWzjXi.mjs.map
