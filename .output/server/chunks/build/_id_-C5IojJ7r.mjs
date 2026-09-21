import { _ as _sfc_main$1 } from './LoadingSkeleton-B0CSl5DE.mjs';
import { _ as _sfc_main$2 } from './ErrorState-B0QwGpGP.mjs';
import { c as useRoute, u as useTmdb, d as useMyList, a as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$3 } from './ContentRow-DhalaQaz.mjs';
import { _ as _sfc_main$2$1 } from './ContentCard-C9DSSU5M.mjs';
import { defineComponent, computed, ref, watch, unref, withCtx, createTextVNode, toDisplayString, openBlock, createBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { u as useMediaRelease } from './useMediaRelease-BR9XhcFs.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const movieId = computed(() => route.params.id);
    const { getMovieDetails, getCredits, getSimilar, getVideos, getImageUrl } = useTmdb();
    const { isInList } = useMyList();
    const { isComingSoon } = useMediaRelease();
    const movie = ref(null);
    const isUnreleased = computed(() => isComingSoon(movie.value));
    const topCast = ref([]);
    const directorName = ref(null);
    const similarMovies = ref([]);
    const trailerKey = ref(null);
    const isTrailerOpen = ref(false);
    const loading = ref(true);
    const error = ref(null);
    const inList = computed(() => movie.value ? isInList(movie.value.id, "movie") : false);
    const formattedRuntime = computed(() => {
      var _a;
      if (!((_a = movie.value) == null ? void 0 : _a.runtime)) return "";
      const hrs = Math.floor(movie.value.runtime / 60);
      const mins = movie.value.runtime % 60;
      return `${hrs}h ${mins}m`;
    });
    const getInitials = (name) => {
      if (!name) return "??";
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };
    const loadData = async () => {
      var _a;
      loading.value = true;
      error.value = null;
      trailerKey.value = null;
      try {
        const [movieData, creditsData, similarData, videosData] = await Promise.all([
          getMovieDetails(movieId.value),
          getCredits("movie", movieId.value).catch(() => ({ cast: [], crew: [] })),
          getSimilar("movie", movieId.value).catch(() => ({ results: [] })),
          getVideos("movie", movieId.value).catch(() => [])
        ]);
        movie.value = movieData;
        if (videosData && videosData.length > 0) {
          const trailer = videosData.find((v) => v.site === "YouTube" && (v.type === "Trailer" || v.official)) || videosData[0];
          if (trailer && trailer.key) {
            trailerKey.value = trailer.key;
          }
        }
        if (movie.value) {
          useSeoMeta({
            title: `${movie.value.title} (${((_a = movie.value.release_date) == null ? void 0 : _a.substring(0, 4)) || ""}) - Stream on RHFlix`,
            ogTitle: `${movie.value.title} - Stream on RHFlix`,
            description: movie.value.overview,
            ogDescription: movie.value.overview,
            ogImage: movie.value.backdrop_path ? getImageUrl(movie.value.backdrop_path, "w500") : void 0,
            ogUrl: `https://rhflix.rehmanwebs.com/movie/${movie.value.id}`,
            twitterCard: "summary_large_image"
          });
          useHead({
            link: [
              { rel: "canonical", href: `https://rhflix.rehmanwebs.com/movie/${movie.value.id}` }
            ],
            script: [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Movie",
                  "name": movie.value.title,
                  "url": `https://rhflix.rehmanwebs.com/movie/${movie.value.id}`,
                  "image": movie.value.poster_path ? getImageUrl(movie.value.poster_path, "w500") : void 0,
                  "description": movie.value.overview,
                  "datePublished": movie.value.release_date,
                  "aggregateRating": movie.value.vote_average ? {
                    "@type": "AggregateRating",
                    "ratingValue": movie.value.vote_average,
                    "bestRating": 10,
                    "ratingCount": movie.value.vote_count || 100
                  } : void 0
                })
              }
            ]
          });
        }
        if (creditsData) {
          topCast.value = (creditsData.cast || []).slice(0, 12);
          const dir = (creditsData.crew || []).find((c) => c.job === "Director");
          directorName.value = dir ? dir.name : null;
        }
        if (similarData && similarData.results) {
          similarMovies.value = similarData.results.map((item) => ({
            ...item,
            media_type: "movie"
          }));
        }
      } catch (err) {
        error.value = (err == null ? void 0 : err.message) || "Failed to fetch movie details from TMDB.";
      } finally {
        loading.value = false;
      }
    };
    watch(() => movieId.value, () => {
      loadData();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_LoadingSkeleton = _sfc_main$1;
      const _component_ErrorState = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ContentRow = _sfc_main$3;
      const _component_TrailerModal = _sfc_main$2$1;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_LoadingSkeleton, { type: "detail" }, null, _parent));
      } else if (unref(error)) {
        _push(ssrRenderComponent(_component_ErrorState, {
          title: "Movie Details Unavailable",
          message: unref(error),
          retry: loadData
        }, null, _parent));
      } else if (unref(movie)) {
        _push(`<div class="relative space-y-12"><div class="relative w-full h-[45vh] sm:h-[55vh] min-h-[350px] overflow-hidden bg-marxi-950"><img${ssrRenderAttr("src", unref(getImageUrl)(unref(movie).backdrop_path || unref(movie).poster_path, "original"))}${ssrRenderAttr("alt", unref(movie).title)} class="w-full h-full object-cover object-center scale-105 filter blur-xs"><div class="absolute inset-0 bg-gradient-to-t from-marxi-900 via-marxi-950/80 to-transparent"></div><div class="absolute inset-0 bg-gradient-to-r from-marxi-900 via-marxi-900/80 to-transparent"></div></div><div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-64 z-10 space-y-10 sm:space-y-12 pb-16"><div class="flex flex-col md:flex-row gap-6 sm:gap-8 items-start"><div class="w-40 sm:w-64 lg:w-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-marxi-700/60 bg-marxi-850 shrink-0 mx-auto md:mx-0"><img${ssrRenderAttr("src", unref(getImageUrl)(unref(movie).poster_path, "w500"))}${ssrRenderAttr("alt", unref(movie).title)} class="w-full h-auto object-cover"></div><div class="flex-1 space-y-4 sm:space-y-5 text-center md:text-left"><div class="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-2.5 text-xs font-semibold">`);
        if (unref(isUnreleased)) {
          _push(`<span class="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold rounded-lg uppercase tracking-wider text-[10px] shadow-md flex items-center space-x-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg><span>Coming Soon</span></span>`);
        } else {
          _push(`<span class="px-2.5 py-1 bg-marxi-accent text-white font-bold rounded-lg uppercase tracking-wider text-[10px]"> Movie </span>`);
        }
        if (unref(movie).vote_average && unref(movie).vote_average > 0) {
          _push(`<div class="flex items-center space-x-1 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-marxi-gold border border-white/10"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span class="text-white font-bold">${ssrInterpolate(unref(movie).vote_average.toFixed(1))}</span>`);
          if (unref(movie).vote_count) {
            _push(`<span class="text-gray-400 font-normal">(${ssrInterpolate(unref(movie).vote_count)} votes)</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(movie).release_date) {
          _push(`<span class="px-2.5 py-1 bg-marxi-800 rounded-lg text-gray-300 border border-marxi-700">${ssrInterpolate(unref(isUnreleased) ? `Expected: ${unref(movie).release_date}` : unref(movie).release_date)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(movie).runtime) {
          _push(`<span class="px-2.5 py-1 bg-marxi-800 rounded-lg text-gray-300 border border-marxi-700">${ssrInterpolate(unref(formattedRuntime))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-1"><h1 class="text-2xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">${ssrInterpolate(unref(movie).title)}</h1>`);
        if (unref(movie).tagline) {
          _push(`<p class="text-marxi-accent font-medium italic text-xs sm:text-base"> &quot;${ssrInterpolate(unref(movie).tagline)}&quot; </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(movie).genres && unref(movie).genres.length > 0) {
          _push(`<div class="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2"><!--[-->`);
          ssrRenderList(unref(movie).genres, (genre) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: genre.id,
              to: `/categories?type=movie&genre=${genre.id}`,
              class: "px-2.5 py-1 bg-marxi-850 hover:bg-marxi-800 text-xs font-semibold text-gray-300 hover:text-white rounded-full border border-marxi-700 hover:border-marxi-gold/50 transition-colors"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(genre.name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(genre.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(isUnreleased)) {
          _push(`<div class="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-900/10 to-transparent border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start space-x-3 shadow-lg"><div class="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-400 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="space-y-1 text-left"><p class="font-bold text-white text-xs sm:text-sm"> This title is not yet available for streaming. </p><p class="text-gray-300 text-xs leading-relaxed"> Scheduled release: <strong class="text-amber-400">${ssrInterpolate(_ctx.formattedReleaseDate(unref(movie)))}</strong>. Streaming servers do not have this title yet. You can watch the official trailer below or bookmark it to your list! </p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">`);
        if (!unref(isUnreleased)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/watch/movie/${unref(movie).id}`,
            class: "px-6 py-3 sm:px-8 sm:py-3.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold rounded-xl flex items-center space-x-2.5 shadow-glow-red hover:scale-105 transition-all duration-200 min-h-[44px]"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"${_scopeId}></path></svg><span${_scopeId}>Watch Movie</span>`);
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
                  createVNode("span", null, "Watch Movie")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(isUnreleased) && unref(trailerKey)) {
          _push(`<button class="px-6 py-3 sm:px-8 sm:py-3.5 bg-marxi-gold hover:bg-amber-400 text-black font-extrabold rounded-xl flex items-center space-x-2.5 shadow-lg hover:scale-105 transition-all duration-200 min-h-[44px]"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg><span>Watch Official Trailer</span></button>`);
        } else if (unref(isUnreleased)) {
          _push(`<div class="px-5 py-3 sm:px-6 sm:py-3.5 bg-marxi-800 text-amber-400 font-bold rounded-xl flex items-center space-x-2 border border-amber-500/30 min-h-[44px]"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg><span>Coming Soon</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!unref(isUnreleased) && unref(trailerKey)) {
          _push(`<button class="px-5 py-3 sm:px-6 sm:py-3.5 bg-marxi-800 hover:bg-marxi-700 text-marxi-gold font-bold rounded-xl flex items-center space-x-2 border border-marxi-gold/30 hover:border-marxi-gold transition-all min-h-[44px] shadow-md"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 3h6a1 1 0 010 2H7a1 1 0 010-2zm0 4h6a1 1 0 010 2H7a1 1 0 010-2zm0 4h4a1 1 0 010 2H7a1 1 0 010-2z" clip-rule="evenodd"></path></svg><span>Watch Trailer</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="px-5 py-3 sm:px-6 sm:py-3.5 bg-marxi-850 hover:bg-marxi-800 text-white font-semibold rounded-xl flex items-center space-x-2 border border-marxi-700 transition-colors min-h-[44px]">`);
        if (!unref(inList)) {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`);
        } else {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-marxi-accent fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`);
        }
        _push(`<span>${ssrInterpolate(unref(inList) ? "In My List" : unref(isUnreleased) ? "Remind Me" : "Add to My List")}</span></button></div><div class="space-y-1.5 pt-2 border-t border-marxi-800/80 text-left"><h3 class="text-white font-bold text-sm sm:text-base">Story Overview</h3><p class="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-3xl">${ssrInterpolate(unref(movie).overview || "No description available for this title.")}</p></div><div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-3 border-t border-marxi-800/80 text-xs text-left">`);
        if (unref(directorName)) {
          _push(`<div><span class="text-gray-400 block">Director</span><span class="text-white font-semibold">${ssrInterpolate(unref(directorName))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><span class="text-gray-400 block">Original Language</span><span class="text-white font-semibold uppercase">${ssrInterpolate(unref(movie).original_language || "EN")}</span></div><div><span class="text-gray-400 block">Popularity Score</span><span class="text-white font-semibold">${ssrInterpolate(unref(movie).popularity ? unref(movie).popularity.toFixed(0) : "N/A")}</span></div><div><span class="text-gray-400 block">Status</span><span class="text-white font-semibold">${ssrInterpolate(unref(movie).status || "Released")}</span></div></div></div></div>`);
        if (unref(topCast).length > 0) {
          _push(`<div class="space-y-4 pt-6 border-t border-marxi-800"><div class="flex items-center space-x-3"><div class="w-1.5 h-6 bg-marxi-accent rounded-full"></div><h2 class="font-display text-lg sm:text-2xl font-bold text-white tracking-tight"> Top Cast &amp; Starring </h2></div><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"><!--[-->`);
          ssrRenderList(unref(topCast), (actor) => {
            _push(`<div class="group relative bg-marxi-850 hover:bg-marxi-800 p-2.5 sm:p-3 rounded-2xl border border-marxi-800 hover:border-marxi-700 transition-all duration-300 flex items-center space-x-3"><div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-marxi-800 shrink-0 border border-marxi-700 shadow-md group-hover:scale-105 transition-transform">`);
            if (actor.profile_path) {
              _push(`<img${ssrRenderAttr("src", unref(getImageUrl)(actor.profile_path, "w185"))}${ssrRenderAttr("alt", actor.name)} class="w-full h-full object-cover object-top" loading="lazy">`);
            } else {
              _push(`<div class="w-full h-full bg-gradient-to-tr from-marxi-800 to-marxi-700 flex items-center justify-center font-bold text-xs text-marxi-accent tracking-wider">${ssrInterpolate(getInitials(actor.name))}</div>`);
            }
            _push(`</div><div class="min-w-0 flex-1"><h4 class="text-xs font-bold text-white group-hover:text-marxi-accent truncate transition-colors">${ssrInterpolate(actor.name)}</h4><p class="text-[10px] sm:text-[11px] text-gray-400 truncate mt-0.5 font-medium">${ssrInterpolate(actor.character || "Cast")}</p></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(similarMovies).length > 0) {
          _push(ssrRenderComponent(_component_ContentRow, {
            title: "More Like This",
            items: unref(similarMovies),
            layout: "grid"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_TrailerModal, {
        isOpen: unref(isTrailerOpen),
        videoKey: unref(trailerKey),
        title: (_a = unref(movie)) == null ? void 0 : _a.title,
        onClose: ($event) => isTrailerOpen.value = false
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/movie/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-C5IojJ7r.mjs.map
