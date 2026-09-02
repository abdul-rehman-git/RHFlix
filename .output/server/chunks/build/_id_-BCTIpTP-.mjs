import { c as useRoute, u as useTmdb, d as useMyList, a as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './PlaybackPlayer-B-tS9cvD.mjs';
import { _ as _sfc_main$2 } from './ContentRow-CH0wMBvS.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { u as useWatchHistory } from './useWatchHistory-Dtam6eb4.mjs';
import { u as useSeoMeta, a as useHead } from './v3-BoNLv2pz.mjs';
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
import './LoadingSkeleton-B0CSl5DE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const movieId = computed(() => route.params.id);
    const { getMovieDetails, getCredits, getSimilar, getImageUrl } = useTmdb();
    const { addWatchHistory } = useWatchHistory();
    const { isInList } = useMyList();
    const movie = ref(null);
    const topCast = ref([]);
    const similarMovies = ref([]);
    const inList = computed(() => movie.value ? isInList(movie.value.id, "movie") : false);
    const getInitials = (name) => {
      if (!name) return "??";
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };
    const loadWatchData = async () => {
      try {
        const [movieData, creditsData, similarData] = await Promise.all([
          getMovieDetails(movieId.value),
          getCredits("movie", movieId.value).catch(() => ({ cast: [], crew: [] })),
          getSimilar("movie", movieId.value).catch(() => ({ results: [] }))
        ]);
        movie.value = movieData;
        if (movie.value) {
          useSeoMeta({
            title: `Watching ${movie.value.title} - RHFlix`,
            ogTitle: `Watching ${movie.value.title} - RHFlix`,
            description: movie.value.overview,
            ogDescription: movie.value.overview,
            ogImage: movie.value.backdrop_path ? getImageUrl(movie.value.backdrop_path, "w500") : void 0
          });
          useHead({
            link: [
              { rel: "canonical", href: `https://reflix.rehmanwebs.com/watch/movie/${movie.value.id}` }
            ]
          });
          addWatchHistory({
            tmdbId: movie.value.id,
            type: "movie",
            title: movie.value.title,
            posterPath: movie.value.poster_path,
            backdropPath: movie.value.backdrop_path
          });
        }
        if (creditsData) {
          topCast.value = (creditsData.cast || []).slice(0, 12);
        }
        if (similarData && similarData.results) {
          similarMovies.value = similarData.results.map((item) => ({
            ...item,
            media_type: "movie"
          }));
        }
      } catch (err) {
        console.error("Error fetching movie details for watch page:", err);
      }
    };
    watch(() => movieId.value, () => {
      loadWatchData();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_PlaybackPlayer = _sfc_main$1;
      const _component_ContentRow = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-8" }, _attrs))}><div class="flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/movie/${unref(movieId)}`,
        class: "inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-marxi-850/90 hover:bg-marxi-800 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-marxi-700/80 transition-colors min-h-[40px] sm:min-h-[44px]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId}></path></svg><span${_scopeId}>Back to Movie</span>`);
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
                  d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                })
              ])),
              createVNode("span", null, "Back to Movie")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center space-x-2 text-xs font-semibold text-gray-400"><span class="px-2.5 py-1 bg-marxi-accent text-white rounded-md uppercase font-bold text-[9px] sm:text-[10px] tracking-wider shadow-glow-red"> Now Playing </span></div></div><div class="-mx-3 sm:mx-0">`);
      _push(ssrRenderComponent(_component_PlaybackPlayer, {
        mediaType: "movie",
        tmdbId: unref(movieId),
        title: (_a = unref(movie)) == null ? void 0 : _a.title
      }, null, _parent));
      _push(`</div>`);
      if (unref(movie)) {
        _push(`<div class="bg-marxi-850 rounded-2xl p-4 sm:p-6 border border-marxi-800/80 space-y-3 sm:space-y-4 shadow-xl"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-marxi-800/80 pb-3.5"><div><div class="flex items-center space-x-2 text-[11px] sm:text-xs font-semibold text-gray-400 mb-1"><span class="px-1.5 py-0.5 bg-marxi-700/60 rounded text-gray-300 font-bold uppercase text-[9px]"> Movie </span>`);
        if (unref(movie).release_date) {
          _push(`<span>\u2022 ${ssrInterpolate(unref(movie).release_date.substring(0, 4))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(movie).vote_average) {
          _push(`<span class="text-marxi-gold flex items-center"> \u2605 ${ssrInterpolate(unref(movie).vote_average.toFixed(1))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="text-lg sm:text-3xl font-display font-black text-white tracking-tight">${ssrInterpolate(unref(movie).title)}</h1></div><button class="px-4 py-2.5 bg-marxi-800 hover:bg-marxi-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 border border-white/10 transition-colors shrink-0 min-h-[44px]">`);
        if (!unref(inList)) {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`);
        } else {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-marxi-accent fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`);
        }
        _push(`<span>${ssrInterpolate(unref(inList) ? "Saved in My List" : "Add to My List")}</span></button></div><p class="text-xs sm:text-sm text-gray-300 leading-relaxed">${ssrInterpolate(unref(movie).overview || "Streaming movie playback on Marxi OTT.")}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(topCast).length > 0) {
        _push(`<div class="space-y-3 sm:space-y-4 pt-2 sm:pt-4 border-t border-marxi-800/80"><div class="flex items-center space-x-2.5"><div class="w-1.5 h-5 sm:h-6 bg-marxi-accent rounded-full"></div><h3 class="font-display text-base sm:text-xl font-bold text-white tracking-tight"> Top Cast &amp; Starring </h3></div><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3"><!--[-->`);
        ssrRenderList(unref(topCast), (actor) => {
          _push(`<div class="group relative bg-marxi-850 hover:bg-marxi-800 p-2 sm:p-3 rounded-2xl border border-marxi-800/80 hover:border-marxi-700 transition-all duration-300 flex items-center space-x-2.5"><div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-marxi-800 shrink-0 border border-marxi-700 shadow-md group-hover:scale-105 transition-transform">`);
          if (actor.profile_path) {
            _push(`<img${ssrRenderAttr("src", unref(getImageUrl)(actor.profile_path, "w185"))}${ssrRenderAttr("alt", actor.name)} class="w-full h-full object-cover object-top" loading="lazy">`);
          } else {
            _push(`<div class="w-full h-full bg-gradient-to-tr from-marxi-800 to-marxi-700 flex items-center justify-center font-bold text-[10px] text-marxi-accent tracking-wider">${ssrInterpolate(getInitials(actor.name))}</div>`);
          }
          _push(`</div><div class="min-w-0 flex-1"><h4 class="text-xs font-bold text-white group-hover:text-marxi-accent truncate transition-colors">${ssrInterpolate(actor.name)}</h4><p class="text-[10px] sm:text-[11px] text-gray-400 truncate mt-0.5 font-medium">${ssrInterpolate(actor.character || "Cast")}</p></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(similarMovies).length > 0) {
        _push(ssrRenderComponent(_component_ContentRow, {
          title: "More Movies Like This",
          items: unref(similarMovies),
          layout: "grid"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/watch/movie/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-BCTIpTP-.mjs.map
