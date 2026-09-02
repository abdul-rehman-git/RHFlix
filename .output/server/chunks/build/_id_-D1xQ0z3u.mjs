import { _ as _sfc_main$3 } from './LoadingSkeleton-B0CSl5DE.mjs';
import { _ as _sfc_main$4 } from './ErrorState-B0QwGpGP.mjs';
import { c as useRoute, u as useTmdb, d as useMyList, a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, computed, ref, watch, unref, withCtx, openBlock, createBlock, createVNode, isRef, mergeProps, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { _ as _sfc_main$5 } from './ContentRow-CH0wMBvS.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SeasonSelector",
  __ssrInlineRender: true,
  props: {
    seasons: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const validSeasons = computed(() => {
      return props.seasons ? props.seasons.filter((s) => s.season_number > 0) : [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center space-x-3 overflow-x-auto hide-scrollbar py-2" }, _attrs))}><!--[-->`);
      ssrRenderList(unref(validSeasons), (season) => {
        _push(`<button class="${ssrRenderClass([[
          __props.modelValue === season.season_number ? "bg-marxi-accent text-white shadow-glow-red" : "bg-marxi-800 text-gray-300 hover:bg-marxi-700 hover:text-white border border-marxi-700"
        ], "px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200"])}">${ssrInterpolate(season.name || `Season ${season.season_number}`)} <span class="ml-1 text-xs opacity-75">(${ssrInterpolate(season.episode_count)} Ep)</span></button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/SeasonSelector.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "EpisodeList",
  __ssrInlineRender: true,
  props: {
    tvId: {},
    seasonNumber: {},
    episodes: {},
    backdropPath: {}
  },
  setup(__props) {
    const { getImageUrl } = useTmdb();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3 sm:space-y-4" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.episodes, (episode) => {
        _push(`<div class="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 bg-marxi-850 hover:bg-marxi-800 rounded-2xl border border-marxi-800 hover:border-marxi-700 transition-all duration-200 gap-3 sm:gap-4"><div class="flex items-start space-x-3 sm:space-x-4 w-full sm:w-auto flex-1 min-w-0"><div class="font-display font-black text-sm sm:text-lg text-gray-400 group-hover:text-marxi-accent w-5 sm:w-6 text-center shrink-0 mt-1 sm:mt-0">${ssrInterpolate(episode.episode_number)}</div><div class="relative aspect-video w-24 sm:w-40 rounded-xl overflow-hidden bg-marxi-800 shrink-0 border border-marxi-700"><img${ssrRenderAttr("src", unref(getImageUrl)(episode.still_path || __props.backdropPath, "w342"))}${ssrRenderAttr("alt", episode.name || `Episode ${episode.episode_number}`)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"><div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-marxi-accent text-white flex items-center justify-center shadow-md"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current ml-0.5" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg></div></div></div><div class="space-y-0.5 sm:space-y-1 min-w-0 flex-1"><div class="flex items-center space-x-2"><h4 class="font-bold text-xs sm:text-base text-white truncate group-hover:text-marxi-accent transition-colors">${ssrInterpolate(episode.name || `Episode ${episode.episode_number}`)}</h4></div>`);
        if (episode.air_date) {
          _push(`<p class="text-[11px] sm:text-xs text-gray-400 font-medium"> Air Date: ${ssrInterpolate(episode.air_date)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (episode.overview) {
          _push(`<p class="text-[11px] sm:text-xs text-gray-400 line-clamp-2 leading-relaxed">${ssrInterpolate(episode.overview)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/watch/tv/${__props.tvId}/${__props.seasonNumber}/${episode.episode_number}`,
          class: "w-full sm:w-auto px-4 py-2.5 bg-marxi-800 group-hover:bg-marxi-accent text-gray-200 group-hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors border border-white/10 shrink-0 min-h-[44px]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"${_scopeId}></path></svg><span${_scopeId}>Play Ep ${ssrInterpolate(episode.episode_number)}</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-4 w-4 fill-current",
                  viewBox: "0 0 20 20"
                }, [
                  createVNode("path", {
                    "fill-rule": "evenodd",
                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z",
                    "clip-rule": "evenodd"
                  })
                ])),
                createVNode("span", null, "Play Ep " + toDisplayString(episode.episode_number), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EpisodeList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const tvId = computed(() => route.params.id);
    const { getTVDetails, getSeasonDetails, getCredits, getSimilar, getImageUrl } = useTmdb();
    const { isInList } = useMyList();
    const show = ref(null);
    const topCast = ref([]);
    const similarShows = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const selectedSeasonNumber = ref(1);
    const currentSeasonDetails = ref(null);
    const loadingSeason = ref(false);
    const inList = computed(() => show.value ? isInList(show.value.id, "tv") : false);
    const getInitials = (name) => {
      if (!name) return "??";
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };
    const fetchSeason = async (seasonNum) => {
      if (!show.value) return;
      loadingSeason.value = true;
      try {
        currentSeasonDetails.value = await getSeasonDetails(show.value.id, seasonNum);
      } catch (err) {
        console.error(`Error loading season ${seasonNum}:`, err);
      } finally {
        loadingSeason.value = false;
      }
    };
    watch(selectedSeasonNumber, (newNum) => {
      fetchSeason(newNum);
    });
    const loadData = async () => {
      loading.value = true;
      error.value = null;
      try {
        const [showData, creditsData, similarData] = await Promise.all([
          getTVDetails(tvId.value),
          getCredits("tv", tvId.value).catch(() => ({ cast: [], crew: [] })),
          getSimilar("tv", tvId.value).catch(() => ({ results: [] }))
        ]);
        show.value = showData;
        if (show.value) {
          useSeoMeta({
            title: `${show.value.name} - Stream TV Series on RHFlix`,
            ogTitle: `${show.value.name} - Stream TV Series on RHFlix`,
            description: show.value.overview,
            ogDescription: show.value.overview,
            ogImage: show.value.backdrop_path ? getImageUrl(show.value.backdrop_path, "w500") : void 0
          });
          useHead({
            link: [
              { rel: "canonical", href: `https://reflix.rehmanwebs.com/tv/${show.value.id}` }
            ],
            script: [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "TVSeries",
                  "name": show.value.name,
                  "image": show.value.poster_path ? getImageUrl(show.value.poster_path, "w500") : void 0,
                  "description": show.value.overview,
                  "numberOfSeasons": show.value.number_of_seasons,
                  "numberOfEpisodes": show.value.number_of_episodes,
                  "aggregateRating": show.value.vote_average ? {
                    "@type": "AggregateRating",
                    "ratingValue": show.value.vote_average,
                    "bestRating": 10,
                    "ratingCount": show.value.vote_count || 100
                  } : void 0
                })
              }
            ]
          });
          if (show.value.seasons && show.value.seasons.length > 0) {
            const firstValid = show.value.seasons.find((s) => s.season_number > 0);
            selectedSeasonNumber.value = firstValid ? firstValid.season_number : 1;
          }
          await fetchSeason(selectedSeasonNumber.value);
        }
        if (creditsData) {
          topCast.value = (creditsData.cast || []).slice(0, 12);
        }
        if (similarData && similarData.results) {
          similarShows.value = similarData.results.map((item) => ({
            ...item,
            media_type: "tv"
          }));
        }
      } catch (err) {
        error.value = (err == null ? void 0 : err.message) || "Failed to fetch TV details from TMDB.";
      } finally {
        loading.value = false;
      }
    };
    watch(() => tvId.value, () => {
      loadData();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoadingSkeleton = _sfc_main$3;
      const _component_ErrorState = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_SeasonSelector = _sfc_main$2;
      const _component_EpisodeList = _sfc_main$1;
      const _component_ContentRow = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(loading)) {
        _push(ssrRenderComponent(_component_LoadingSkeleton, { type: "detail" }, null, _parent));
      } else if (unref(error)) {
        _push(ssrRenderComponent(_component_ErrorState, {
          title: "TV Show Details Unavailable",
          message: unref(error),
          retry: loadData
        }, null, _parent));
      } else if (unref(show)) {
        _push(`<div class="relative"><div class="relative w-full h-[45vh] sm:h-[55vh] min-h-[350px] overflow-hidden bg-marxi-950"><img${ssrRenderAttr("src", unref(getImageUrl)(unref(show).backdrop_path || unref(show).poster_path, "original"))}${ssrRenderAttr("alt", unref(show).name)} class="w-full h-full object-cover object-center scale-105 filter blur-xs"><div class="absolute inset-0 bg-gradient-to-t from-marxi-900 via-marxi-950/80 to-transparent"></div><div class="absolute inset-0 bg-gradient-to-r from-marxi-900 via-marxi-900/80 to-transparent"></div></div><div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-64 z-10 pb-16 space-y-10 sm:space-y-12"><div class="flex flex-col md:flex-row gap-6 sm:gap-8 items-start"><div class="w-40 sm:w-64 lg:w-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-marxi-700/60 bg-marxi-850 shrink-0 mx-auto md:mx-0"><img${ssrRenderAttr("src", unref(getImageUrl)(unref(show).poster_path, "w500"))}${ssrRenderAttr("alt", unref(show).name)} class="w-full h-auto object-cover"></div><div class="flex-1 space-y-4 sm:space-y-5 text-center md:text-left"><div class="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-2.5 text-xs font-semibold"><span class="px-2.5 py-1 bg-marxi-accent text-white font-bold rounded-lg uppercase tracking-wider text-[10px]"> TV Series </span>`);
        if (unref(show).vote_average) {
          _push(`<div class="flex items-center space-x-1 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-marxi-gold border border-white/10"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg><span class="text-white font-bold">${ssrInterpolate(unref(show).vote_average.toFixed(1))}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(show).number_of_seasons) {
          _push(`<span class="px-2.5 py-1 bg-marxi-800 rounded-lg text-gray-300 border border-marxi-700">${ssrInterpolate(unref(show).number_of_seasons)} Seasons </span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(show).number_of_episodes) {
          _push(`<span class="px-2.5 py-1 bg-marxi-800 rounded-lg text-gray-300 border border-marxi-700">${ssrInterpolate(unref(show).number_of_episodes)} Episodes </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-1"><h1 class="text-2xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">${ssrInterpolate(unref(show).name)}</h1>`);
        if (unref(show).tagline) {
          _push(`<p class="text-marxi-accent font-medium italic text-xs sm:text-base"> &quot;${ssrInterpolate(unref(show).tagline)}&quot; </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(show).genres && unref(show).genres.length > 0) {
          _push(`<div class="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2"><!--[-->`);
          ssrRenderList(unref(show).genres, (genre) => {
            _push(`<span class="px-2.5 py-1 bg-marxi-850 text-xs font-semibold text-gray-300 rounded-full border border-marxi-700">${ssrInterpolate(genre.name)}</span>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/watch/tv/${unref(show).id}/1/1`,
          class: "px-6 py-3 sm:px-8 sm:py-3.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold rounded-xl flex items-center space-x-2.5 shadow-glow-red hover:scale-105 transition-all duration-200 min-h-[44px]"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"${_scopeId}></path></svg><span${_scopeId}>Start Watching (S1 E1)</span>`);
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
                createVNode("span", null, "Start Watching (S1 E1)")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<button class="px-5 py-3 sm:px-6 sm:py-3.5 bg-marxi-850 hover:bg-marxi-800 text-white font-semibold rounded-xl flex items-center space-x-2 border border-marxi-700 transition-colors min-h-[44px]">`);
        if (!unref(inList)) {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>`);
        } else {
          _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-marxi-accent fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>`);
        }
        _push(`<span>${ssrInterpolate(unref(inList) ? "In My List" : "Add to My List")}</span></button></div><div class="space-y-1.5 pt-2 border-t border-marxi-800/80 text-left"><h3 class="text-white font-bold text-sm sm:text-base">Synopsis</h3><p class="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-3xl">${ssrInterpolate(unref(show).overview || "No synopsis available for this TV series.")}</p></div></div></div>`);
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
        _push(`<div class="space-y-6 pt-6 border-t border-marxi-800"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><h2 class="font-display text-xl sm:text-2xl font-bold text-white tracking-tight"> Seasons &amp; Episodes </h2>`);
        if (unref(show).seasons && unref(show).seasons.length > 0) {
          _push(ssrRenderComponent(_component_SeasonSelector, {
            seasons: unref(show).seasons,
            modelValue: unref(selectedSeasonNumber),
            "onUpdate:modelValue": ($event) => isRef(selectedSeasonNumber) ? selectedSeasonNumber.value = $event : null
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(loadingSeason)) {
          _push(`<div class="py-12 text-center space-y-3"><div class="w-8 h-8 border-4 border-marxi-accent border-t-transparent rounded-full animate-spin mx-auto"></div><p class="text-xs text-gray-400">Fetching Season ${ssrInterpolate(unref(selectedSeasonNumber))} details...</p></div>`);
        } else if (unref(currentSeasonDetails) && unref(currentSeasonDetails).episodes) {
          _push(ssrRenderComponent(_component_EpisodeList, {
            tvId: unref(show).id,
            seasonNumber: unref(selectedSeasonNumber),
            episodes: unref(currentSeasonDetails).episodes,
            backdropPath: unref(show).backdrop_path
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(similarShows).length > 0) {
          _push(ssrRenderComponent(_component_ContentRow, {
            title: "More TV Series Like This",
            items: unref(similarShows),
            layout: "grid"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tv/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-D1xQ0z3u.mjs.map
