import { _ as _sfc_main$2 } from './LoadingSkeleton-B0CSl5DE.mjs';
import { u as useTmdb, a as __nuxt_component_0$1, d as useMyList } from './server.mjs';
import { defineComponent, computed, ref, unref, withCtx, createVNode, openBlock, createBlock, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$3 } from './ContentRow-CH0wMBvS.mjs';
import { u as useSeoMeta, a as useHead } from './v3-BoNLv2pz.mjs';
import { u as useWatchHistory } from './useWatchHistory-Dtam6eb4.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import './ContentCard-BrOWzjXi.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Hero",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const props = __props;
    const { getImageUrl } = useTmdb();
    const { isInList } = useMyList();
    const isMovie = computed(() => Boolean(props.item.title || props.item.media_type === "movie"));
    const releaseYear = computed(() => {
      const dateStr = props.item.release_date || props.item.first_air_date;
      return dateStr ? dateStr.substring(0, 4) : "";
    });
    const watchUrl = computed(() => {
      return isMovie.value ? `/watch/movie/${props.item.id}` : `/watch/tv/${props.item.id}/1/1`;
    });
    const detailsUrl = computed(() => {
      return isMovie.value ? `/movie/${props.item.id}` : `/tv/${props.item.id}`;
    });
    const inList = computed(() => {
      return isInList(props.item.id, isMovie.value ? "movie" : "tv");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      if (__props.item) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-full h-[60vh] min-h-[460px] sm:h-[70vh] sm:min-h-[520px] max-h-[750px] overflow-hidden bg-marxi-950" }, _attrs))}><div class="absolute inset-0"><img${ssrRenderAttr("src", unref(getImageUrl)(__props.item.backdrop_path || __props.item.poster_path, "original"))}${ssrRenderAttr("alt", __props.item.title || __props.item.name || "Hero Backdrop")} class="w-full h-full object-cover object-center scale-105 transform animate-fade-in"><div class="absolute inset-0 bg-gradient-to-r from-marxi-950 via-marxi-950/85 sm:via-marxi-950/75 to-transparent"></div><div class="absolute inset-0 bg-gradient-to-t from-marxi-900 via-transparent to-marxi-950/60"></div></div><div class="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center"><div class="max-w-2xl space-y-3 sm:space-y-4 pt-12 sm:pt-0"><div class="flex items-center space-x-2.5 sm:space-x-3 text-xs font-semibold"><span class="px-2.5 py-1 bg-marxi-accent text-white rounded-md tracking-wider uppercase font-bold text-[10px]"> Featured ${ssrInterpolate(__props.item.title ? "Movie" : "TV Show")}</span>`);
        if (__props.item.vote_average) {
          _push(`<div class="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-marxi-gold border border-white/10"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span class="text-white font-bold">${ssrInterpolate(__props.item.vote_average.toFixed(1))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(releaseYear)) {
          _push(`<span class="text-gray-300 font-medium">${ssrInterpolate(unref(releaseYear))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="text-2xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-tight sm:leading-none drop-shadow-md line-clamp-2">${ssrInterpolate(__props.item.title || __props.item.name)}</h1><p class="text-gray-300 text-xs sm:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl drop-shadow">${ssrInterpolate(__props.item.overview || "Stream your favorite movies and series in full HD on RHFlix.")}</p><div class="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(watchUrl),
          class: "px-5 py-3 sm:px-6 sm:py-3.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold rounded-xl flex items-center space-x-2 shadow-glow-red hover:scale-105 active:scale-95 transition-all duration-200 min-h-[44px]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"${_scopeId}></path></svg><span${_scopeId}>Watch Now</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-5 w-5 fill-current",
                  viewBox: "0 0 20 20"
                }, [
                  createVNode("path", {
                    "fill-rule": "evenodd",
                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z",
                    "clip-rule": "evenodd"
                  })
                ])),
                createVNode("span", null, "Watch Now")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(detailsUrl),
          class: "px-5 py-3 sm:px-6 sm:py-3.5 bg-marxi-800/80 hover:bg-marxi-700 text-white font-semibold rounded-xl flex items-center space-x-2 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-200 min-h-[44px]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><span${_scopeId}>More Info</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-5 w-5",
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
                createVNode("span", null, "More Info")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button class="p-3 sm:p-3.5 bg-marxi-800/80 hover:bg-marxi-700 text-white rounded-xl backdrop-blur-md border border-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"${ssrRenderAttr("title", unref(inList) ? "Remove from My List" : "Add to My List")} aria-label="Toggle My List">`);
        if (!unref(inList)) {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`);
        } else {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-marxi-accent fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`);
        }
        _push(`</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Hero.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "RHFlix - Stream Unlimited Movies & TV Shows",
      ogTitle: "RHFlix - Stream Unlimited Movies & TV Shows",
      description: "Stream your favorite movies, top TV series, and trending blockbusters online on RHFlix in full HD.",
      ogDescription: "Stream your favorite movies, top TV series, and trending blockbusters online on RHFlix in full HD."
    });
    useHead({
      link: [
        { rel: "canonical", href: "https://reflix.rehmanwebs.com/" }
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "RHFlix",
            "url": "https://reflix.rehmanwebs.com/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://reflix.rehmanwebs.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }
      ]
    });
    const { getImageUrl } = useTmdb();
    const { history } = useWatchHistory();
    const watchHistoryItems = computed(() => history.value);
    const featuredItem = ref(null);
    const trendingMovies = ref([]);
    const popularMovies = ref([]);
    const topRatedMovies = ref([]);
    const trendingTv = ref([]);
    const popularTv = ref([]);
    const topRatedTv = ref([]);
    const loadingHero = ref(true);
    const loadingMovies = ref(true);
    const loadingTv = ref(true);
    const getWatchUrl = (item) => {
      return item.type === "movie" ? `/watch/movie/${item.tmdbId}` : `/watch/tv/${item.tmdbId}/${item.season || 1}/${item.episode || 1}`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoadingSkeleton = _sfc_main$2;
      const _component_Hero = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ContentRow = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(loadingHero)) {
        _push(ssrRenderComponent(_component_LoadingSkeleton, { type: "hero" }, null, _parent));
      } else if (unref(featuredItem)) {
        _push(ssrRenderComponent(_component_Hero, { item: unref(featuredItem) }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-4 sm:space-y-6 pb-16 pt-4 sm:pt-6">`);
      if (unref(watchHistoryItems) && unref(watchHistoryItems).length > 0) {
        _push(`<section class="py-3 sm:py-4"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between mb-3 sm:mb-4"><div class="flex items-center space-x-2.5 sm:space-x-3"><div class="w-1.5 h-5 sm:h-6 bg-marxi-gold rounded-full"></div><h2 class="font-display text-lg sm:text-2xl font-bold text-white tracking-tight"> Continue Watching </h2></div><button class="text-xs text-gray-400 hover:text-red-400 transition-colors py-1 px-2"> Clear History </button></div><div class="flex items-center space-x-3 sm:space-x-4 overflow-x-auto hide-scrollbar py-2 snap-x snap-mandatory"><!--[-->`);
        ssrRenderList(unref(watchHistoryItems), (item) => {
          _push(`<div class="group flex-none w-44 sm:w-56 bg-marxi-850 rounded-2xl overflow-hidden border border-marxi-800 hover:border-marxi-accent transition-all duration-300 shadow-md snap-start">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: getWatchUrl(item),
            class: "block relative aspect-video bg-marxi-800 overflow-hidden"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr("src", unref(getImageUrl)(item.backdropPath || item.posterPath, "w500"))}${ssrRenderAttr("alt", item.title)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-marxi-950 via-black/20 to-black/40"${_scopeId}></div><div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"${_scopeId}><div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-marxi-accent text-white flex items-center justify-center shadow-glow-red"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"${_scopeId}></path></svg></div></div>`);
              } else {
                return [
                  createVNode("img", {
                    src: unref(getImageUrl)(item.backdropPath || item.posterPath, "w500"),
                    alt: item.title,
                    class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
                    loading: "lazy"
                  }, null, 8, ["src", "alt"]),
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-marxi-950 via-black/20 to-black/40" }),
                  createVNode("div", { class: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" }, [
                    createVNode("div", { class: "w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-marxi-accent text-white flex items-center justify-center shadow-glow-red" }, [
                      (openBlock(), createBlock("svg", {
                        xmlns: "http://www.w3.org/2000/svg",
                        class: "h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5",
                        viewBox: "0 0 20 20"
                      }, [
                        createVNode("path", {
                          "fill-rule": "evenodd",
                          d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z",
                          "clip-rule": "evenodd"
                        })
                      ]))
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="p-2.5 sm:p-3 space-y-0.5 sm:space-y-1"><h4 class="font-bold text-xs sm:text-sm text-white truncate group-hover:text-marxi-accent transition-colors">${ssrInterpolate(item.title)}</h4><p class="text-[11px] sm:text-xs text-marxi-accent font-semibold truncate">${ssrInterpolate(item.type === "tv" ? `S${item.season} E${item.episode}: ${item.episodeName || ""}` : "Movie")}</p></div></div>`);
        });
        _push(`<!--]--></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ContentRow, {
        title: "Trending Movies",
        items: unref(trendingMovies),
        loading: unref(loadingMovies),
        viewAllUrl: "/movies?sort=trending"
      }, null, _parent));
      _push(ssrRenderComponent(_component_ContentRow, {
        title: "Popular Movies",
        items: unref(popularMovies),
        loading: unref(loadingMovies),
        viewAllUrl: "/movies?sort=popular"
      }, null, _parent));
      _push(ssrRenderComponent(_component_ContentRow, {
        title: "Top Rated Movies",
        items: unref(topRatedMovies),
        loading: unref(loadingMovies),
        viewAllUrl: "/movies?sort=top_rated"
      }, null, _parent));
      _push(ssrRenderComponent(_component_ContentRow, {
        title: "Popular TV Shows",
        items: unref(popularTv),
        loading: unref(loadingTv),
        viewAllUrl: "/tv?sort=popular"
      }, null, _parent));
      _push(ssrRenderComponent(_component_ContentRow, {
        title: "Trending TV Shows",
        items: unref(trendingTv),
        loading: unref(loadingTv),
        viewAllUrl: "/tv?sort=trending"
      }, null, _parent));
      _push(ssrRenderComponent(_component_ContentRow, {
        title: "Top Rated TV Shows",
        items: unref(topRatedTv),
        loading: unref(loadingTv),
        viewAllUrl: "/tv?sort=top_rated"
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BQhLtRNF.mjs.map
