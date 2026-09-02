import { c as useRoute, e as useRouter, u as useTmdb, a as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './PlaybackPlayer-B-tS9cvD.mjs';
import { _ as _sfc_main$2 } from './ContentRow-CH0wMBvS.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
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
    useRouter();
    const tvId = computed(() => route.params.id);
    const seasonParam = computed(() => Number(route.params.season) || 1);
    const episodeParam = computed(() => Number(route.params.episode) || 1);
    const currentSeasonNumber = ref(seasonParam.value);
    const currentEpisodeNumber = ref(episodeParam.value);
    const { getTVDetails, getSeasonDetails, getCredits, getSimilar, getImageUrl } = useTmdb();
    const { addWatchHistory } = useWatchHistory();
    const show = ref(null);
    const seasonDetails = ref(null);
    const topCast = ref([]);
    const similarShows = ref([]);
    const validSeasons = computed(() => {
      var _a, _b;
      return ((_b = (_a = show.value) == null ? void 0 : _a.seasons) == null ? void 0 : _b.filter((s) => s.season_number > 0)) || [];
    });
    const activeEpisode = computed(() => {
      var _a;
      return (_a = seasonDetails.value) == null ? void 0 : _a.episodes.find((e) => e.episode_number === currentEpisodeNumber.value);
    });
    const totalEpisodes = computed(() => {
      var _a;
      return ((_a = seasonDetails.value) == null ? void 0 : _a.episodes.length) || 0;
    });
    const hasPrevEpisode = computed(() => currentEpisodeNumber.value > 1);
    const hasNextEpisode = computed(() => currentEpisodeNumber.value < totalEpisodes.value);
    const getInitials = (name) => {
      if (!name) return "??";
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };
    const fetchSeasonData = async (seasonNum) => {
      try {
        seasonDetails.value = await getSeasonDetails(tvId.value, seasonNum);
      } catch (err) {
        console.error(`Error loading season ${seasonNum}:`, err);
      }
    };
    const recordHistory = () => {
      var _a, _b;
      if (show.value) {
        const epName = ((_a = activeEpisode.value) == null ? void 0 : _a.name) || `Episode ${currentEpisodeNumber.value}`;
        addWatchHistory({
          tmdbId: show.value.id,
          type: "tv",
          title: show.value.name,
          posterPath: show.value.poster_path,
          backdropPath: ((_b = activeEpisode.value) == null ? void 0 : _b.still_path) || show.value.backdrop_path,
          season: currentSeasonNumber.value,
          episode: currentEpisodeNumber.value,
          episodeName: epName
        });
      }
    };
    const loadWatchData = async () => {
      try {
        const [showData, creditsData, similarData] = await Promise.all([
          getTVDetails(tvId.value),
          getCredits("tv", tvId.value).catch(() => ({ cast: [], crew: [] })),
          getSimilar("tv", tvId.value).catch(() => ({ results: [] }))
        ]);
        show.value = showData;
        if (show.value) {
          if (route.params.season) {
            currentSeasonNumber.value = Number(route.params.season);
          } else if (validSeasons.value.length > 0) {
            currentSeasonNumber.value = validSeasons.value[0].season_number;
          }
          if (route.params.episode) {
            currentEpisodeNumber.value = Number(route.params.episode);
          }
          useSeoMeta({
            title: `Watching ${show.value.name} S${currentSeasonNumber.value} E${currentEpisodeNumber.value} - RHFlix`,
            ogTitle: `Watching ${show.value.name} S${currentSeasonNumber.value} E${currentEpisodeNumber.value} - RHFlix`,
            description: show.value.overview,
            ogDescription: show.value.overview,
            ogImage: show.value.backdrop_path ? getImageUrl(show.value.backdrop_path, "w500") : void 0
          });
          useHead({
            link: [
              { rel: "canonical", href: `https://reflix.rehmanwebs.com/watch/tv/${show.value.id}` }
            ]
          });
          await fetchSeasonData(currentSeasonNumber.value);
          recordHistory();
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
        console.error("Error fetching TV show watch data:", err);
      }
    };
    watch(() => [route.params.id, route.params.season, route.params.episode], () => {
      if (route.params.season) currentSeasonNumber.value = Number(route.params.season);
      if (route.params.episode) currentEpisodeNumber.value = Number(route.params.episode);
      loadWatchData();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_PlaybackPlayer = _sfc_main$1;
      const _component_ContentRow = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-8" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-2 sm:gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/tv/${unref(tvId)}`,
        class: "inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-marxi-850/90 hover:bg-marxi-800 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-marxi-700/80 transition-colors min-h-[40px] sm:min-h-[44px]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId}></path></svg><span${_scopeId}>Back to Series</span>`);
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
              createVNode("span", null, "Back to Series")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center space-x-2">`);
      if (unref(hasPrevEpisode)) {
        _push(`<button class="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-marxi-850 hover:bg-marxi-800 text-white font-semibold text-xs rounded-xl border border-marxi-700/80 flex items-center space-x-1 transition-colors min-h-[40px] sm:min-h-[44px]"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg><span>Prev</span></button>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasNextEpisode)) {
        _push(`<button class="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-xs rounded-xl shadow-glow-red flex items-center space-x-1 transition-all min-h-[40px] sm:min-h-[44px]"><span>Next Ep</span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="-mx-3 sm:mx-0">`);
      _push(ssrRenderComponent(_component_PlaybackPlayer, {
        mediaType: "tv",
        tmdbId: unref(tvId),
        season: unref(currentSeasonNumber),
        episode: unref(currentEpisodeNumber),
        title: (_a = unref(show)) == null ? void 0 : _a.name
      }, null, _parent));
      _push(`</div><div class="bg-marxi-850 rounded-2xl p-4 sm:p-6 border border-marxi-800/80 space-y-3.5 sm:space-y-6 shadow-xl"><div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-marxi-800/80 pb-3.5 sm:pb-4"><div><div class="flex items-center space-x-2 text-[11px] sm:text-xs font-bold text-marxi-accent mb-1"><span>${ssrInterpolate(((_b = unref(show)) == null ? void 0 : _b.name) || "TV Series")}</span><span>\u2022</span><span>S${ssrInterpolate(unref(currentSeasonNumber))} E${ssrInterpolate(unref(currentEpisodeNumber))}</span></div><h1 class="text-lg sm:text-3xl font-display font-black text-white tracking-tight">${ssrInterpolate(((_c = unref(activeEpisode)) == null ? void 0 : _c.name) || `Episode ${unref(currentEpisodeNumber)}`)}</h1></div><div class="flex items-center space-x-2"><select class="bg-marxi-800 border border-marxi-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-marxi-accent min-h-[40px] sm:min-h-[44px]"><!--[-->`);
      ssrRenderList(unref(validSeasons), (s) => {
        _push(`<option${ssrRenderAttr("value", s.season_number)}${ssrIncludeBooleanAttr(Array.isArray(unref(currentSeasonNumber)) ? ssrLooseContain(unref(currentSeasonNumber), s.season_number) : ssrLooseEqual(unref(currentSeasonNumber), s.season_number)) ? " selected" : ""}> Season ${ssrInterpolate(s.season_number)} (${ssrInterpolate(s.episode_count)} Ep) </option>`);
      });
      _push(`<!--]--></select></div></div><div class="space-y-1"><h3 class="text-white font-bold text-xs sm:text-sm">Episode Overview</h3><p class="text-xs sm:text-sm text-gray-300 leading-relaxed">${ssrInterpolate(((_d = unref(activeEpisode)) == null ? void 0 : _d.overview) || ((_e = unref(show)) == null ? void 0 : _e.overview) || "No episode description available.")}</p></div>`);
      if (unref(seasonDetails) && unref(seasonDetails).episodes) {
        _push(`<div class="space-y-2 pt-3 border-t border-marxi-800/80"><h4 class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider"> Season ${ssrInterpolate(unref(currentSeasonNumber))} Episodes </h4><div class="flex items-center space-x-2 overflow-x-auto hide-scrollbar sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:gap-2 pb-1 sm:pb-0"><!--[-->`);
        ssrRenderList(unref(seasonDetails).episodes, (ep) => {
          _push(`<button class="${ssrRenderClass([[
            ep.episode_number === unref(currentEpisodeNumber) ? "bg-marxi-accent text-white border-marxi-accent shadow-glow-red font-bold" : "bg-marxi-800 text-gray-300 border-marxi-700 hover:bg-marxi-700 hover:text-white"
          ], "px-3.5 py-2 sm:px-2.5 sm:py-2.5 rounded-xl text-center text-xs font-semibold transition-all border whitespace-nowrap min-h-[40px] sm:min-h-[44px] flex items-center justify-center shrink-0"])}"> Ep ${ssrInterpolate(ep.episode_number)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
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
      if (unref(similarShows).length > 0) {
        _push(ssrRenderComponent(_component_ContentRow, {
          title: "More TV Series Like This",
          items: unref(similarShows),
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/watch/tv/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_--MUD3FPF.mjs.map
