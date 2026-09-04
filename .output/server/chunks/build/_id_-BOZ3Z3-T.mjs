import { c as useRoute, u as useTmdb, d as useMyList, a as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './PlaybackPlayer-B-HjWs5W.mjs';
import { _ as _sfc_main$2 } from './ContentRow-CH0wMBvS.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { a as useHead } from './v3-BoNLv2pz.mjs';
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
import './useWatchHistory-CsbYpDkF.mjs';
import './ContentCard-BrOWzjXi.mjs';
import './LoadingSkeleton-B0CSl5DE.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const movieId = computed(() => route.params.id);
    const { getMovieDetails, getSimilar } = useTmdb();
    const { isInList } = useMyList();
    const movie = ref(null);
    const similarMovies = ref([]);
    const loadingSimilar = ref(true);
    const inList = computed(() => {
      if (!movie.value) return false;
      return isInList(movie.value.id, "movie");
    });
    const loadData = async () => {
      if (!movieId.value) return;
      try {
        movie.value = await getMovieDetails(movieId.value);
        const simRes = await getSimilar("movie", movieId.value);
        similarMovies.value = simRes.results || [];
      } catch (err) {
        console.error("Failed to load movie details:", err);
      } finally {
        loadingSimilar.value = false;
      }
    };
    watch(() => movieId.value, () => {
      loadData();
    });
    useHead({
      title: computed(() => movie.value ? `Watch ${movie.value.title} - RHFlix` : "Watch Movie - RHFlix")
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_PlaybackPlayer = _sfc_main$1;
      const _component_ContentRow = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6 sm:space-y-10" }, _attrs))}><div class="flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/movie/${unref(movieId)}`,
        class: "inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-marxi-850 hover:bg-marxi-800 px-3.5 py-2.5 rounded-xl border border-marxi-800 transition-all shadow-md"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId}></path></svg><span${_scopeId}>Back to Movie Details</span>`);
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
              createVNode("span", null, "Back to Movie Details")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center space-x-2"><span class="px-2.5 py-1 bg-marxi-accent text-white rounded-lg uppercase font-bold text-[10px] tracking-wider shadow-glow-red"> Now Watching </span></div></div><div class="-mx-3 sm:mx-0">`);
      _push(ssrRenderComponent(_component_PlaybackPlayer, {
        mediaType: "movie",
        tmdbId: unref(movieId),
        title: (_a = unref(movie)) == null ? void 0 : _a.title,
        posterPath: (_b = unref(movie)) == null ? void 0 : _b.poster_path,
        backdropPath: (_c = unref(movie)) == null ? void 0 : _c.backdrop_path
      }, null, _parent));
      _push(`</div>`);
      if (unref(movie)) {
        _push(`<div class="bg-marxi-850 rounded-2xl p-4 sm:p-7 border border-marxi-800 space-y-4 shadow-xl"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marxi-800 pb-5"><div class="space-y-1.5"><div class="flex items-center flex-wrap gap-2 text-xs font-semibold text-gray-400"><span class="px-2 py-0.5 bg-marxi-800 rounded text-marxi-gold font-bold uppercase text-[10px]"> Movie </span>`);
        if (unref(movie).release_date) {
          _push(`<span>\u2022 ${ssrInterpolate(unref(movie).release_date.substring(0, 4))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(movie).runtime) {
          _push(`<span>\u2022 ${ssrInterpolate(unref(movie).runtime)} mins</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(movie).vote_average) {
          _push(`<span class="text-marxi-gold flex items-center font-bold"> \u2605 ${ssrInterpolate(unref(movie).vote_average.toFixed(1))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><h1 class="text-xl sm:text-3xl font-display font-black text-white tracking-tight">${ssrInterpolate(unref(movie).title)}</h1>`);
        if (unref(movie).tagline) {
          _push(`<p class="text-xs sm:text-sm text-gray-400 italic"> &quot;${ssrInterpolate(unref(movie).tagline)}&quot; </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button class="px-5 py-2.5 bg-marxi-800 hover:bg-marxi-700 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 border border-white/10 transition-all shrink-0 min-h-[44px]">`);
        if (!unref(inList)) {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`);
        } else {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-marxi-accent fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`);
        }
        _push(`<span>${ssrInterpolate(unref(inList) ? "In My List" : "Add to My List")}</span></button></div><div class="space-y-3">`);
        if (unref(movie).genres && unref(movie).genres.length > 0) {
          _push(`<div class="flex flex-wrap gap-1.5"><!--[-->`);
          ssrRenderList(unref(movie).genres, (genre) => {
            _push(`<span class="px-2.5 py-1 rounded-lg bg-marxi-800 text-gray-300 text-xs font-medium border border-white/5">${ssrInterpolate(genre.name)}</span>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<p class="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-4xl">${ssrInterpolate(unref(movie).overview)}</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(similarMovies).length > 0) {
        _push(ssrRenderComponent(_component_ContentRow, {
          title: "You May Also Like",
          items: unref(similarMovies),
          loading: unref(loadingSimilar)
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
//# sourceMappingURL=_id_-BOZ3Z3-T.mjs.map
