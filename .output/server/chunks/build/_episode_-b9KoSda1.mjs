import { c as useRoute, e as useRouter, u as useTmdb, a as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './PlaybackPlayer-B-tS9cvD.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[episode]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const tvId = computed(() => route.params.id);
    const seasonNumber = computed(() => Number(route.params.season) || 1);
    const episodeNumber = computed(() => Number(route.params.episode) || 1);
    const { getTVDetails, getSeasonDetails } = useTmdb();
    const { addWatchHistory } = useWatchHistory();
    const show = ref(null);
    const seasonDetails = ref(null);
    const selectedSeason = ref(seasonNumber.value);
    const currentEpisode = computed(() => {
      var _a;
      return (_a = seasonDetails.value) == null ? void 0 : _a.episodes.find((e) => e.episode_number === episodeNumber.value);
    });
    const totalEpisodesInSeason = computed(() => {
      var _a;
      return ((_a = seasonDetails.value) == null ? void 0 : _a.episodes.length) || 0;
    });
    const hasPrevEpisode = computed(() => {
      return episodeNumber.value > 1 || seasonNumber.value > 1;
    });
    const hasNextEpisode = computed(() => {
      var _a;
      if (episodeNumber.value < totalEpisodesInSeason.value) return true;
      if (((_a = show.value) == null ? void 0 : _a.number_of_seasons) && seasonNumber.value < show.value.number_of_seasons) return true;
      return false;
    });
    const prevEpisodeUrl = computed(() => {
      if (episodeNumber.value > 1) {
        return `/watch/tv/${tvId.value}/${seasonNumber.value}/${episodeNumber.value - 1}`;
      } else if (seasonNumber.value > 1) {
        return `/watch/tv/${tvId.value}/${seasonNumber.value - 1}/1`;
      }
      return `/tv/${tvId.value}`;
    });
    const nextEpisodeUrl = computed(() => {
      var _a;
      if (episodeNumber.value < totalEpisodesInSeason.value) {
        return `/watch/tv/${tvId.value}/${seasonNumber.value}/${episodeNumber.value + 1}`;
      } else if (((_a = show.value) == null ? void 0 : _a.number_of_seasons) && seasonNumber.value < show.value.number_of_seasons) {
        return `/watch/tv/${tvId.value}/${seasonNumber.value + 1}/1`;
      }
      return `/tv/${tvId.value}`;
    });
    const loadShowAndSeasonData = async () => {
      var _a, _b, _c, _d, _e, _f;
      try {
        show.value = await getTVDetails(tvId.value);
        seasonDetails.value = await getSeasonDetails(tvId.value, seasonNumber.value);
        selectedSeason.value = seasonNumber.value;
        const epName = ((_a = currentEpisode.value) == null ? void 0 : _a.name) || `Episode ${episodeNumber.value}`;
        if (show.value) {
          useSeoMeta({
            title: `Watching ${show.value.name} S${seasonNumber.value} E${episodeNumber.value} (${epName}) - RHFlix`,
            ogTitle: `Watching ${show.value.name} S${seasonNumber.value} E${episodeNumber.value} - RHFlix`,
            description: ((_b = currentEpisode.value) == null ? void 0 : _b.overview) || show.value.overview,
            ogDescription: ((_c = currentEpisode.value) == null ? void 0 : _c.overview) || show.value.overview,
            ogImage: ((_d = currentEpisode.value) == null ? void 0 : _d.still_path) || show.value.backdrop_path ? getImageUrl(((_e = currentEpisode.value) == null ? void 0 : _e.still_path) || show.value.backdrop_path || "", "w500") : void 0
          });
          useHead({
            link: [
              { rel: "canonical", href: `https://reflix.rehmanwebs.com/watch/tv/${show.value.id}/${seasonNumber.value}/${episodeNumber.value}` }
            ]
          });
          addWatchHistory({
            tmdbId: show.value.id,
            type: "tv",
            title: show.value.name,
            posterPath: show.value.poster_path,
            backdropPath: ((_f = currentEpisode.value) == null ? void 0 : _f.still_path) || show.value.backdrop_path,
            season: seasonNumber.value,
            episode: episodeNumber.value,
            episodeName: epName
          });
        }
      } catch (err) {
        console.error("Error fetching watch TV data:", err);
      }
    };
    watch(() => [tvId.value, seasonNumber.value, episodeNumber.value], () => {
      loadShowAndSeasonData();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_PlaybackPlayer = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/tv/${unref(tvId)}`,
        class: "inline-flex items-center space-x-2 text-sm font-semibold text-gray-300 hover:text-white bg-marxi-850 hover:bg-marxi-800 px-4 py-2 rounded-xl border border-marxi-700 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"${_scopeId}></path></svg><span${_scopeId}>Back to Series Details</span>`);
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
              createVNode("span", null, "Back to Series Details")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center space-x-3">`);
      if (unref(hasPrevEpisode)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(prevEpisodeUrl),
          class: "px-4 py-2 bg-marxi-850 hover:bg-marxi-800 text-white font-semibold text-xs rounded-xl border border-marxi-700 flex items-center space-x-1.5 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"${_scopeId}></path></svg><span${_scopeId}>Prev Episode</span>`);
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
                    d: "M15 19l-7-7 7-7"
                  })
                ])),
                createVNode("span", null, "Prev Episode")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(hasNextEpisode)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(nextEpisodeUrl),
          class: "px-4 py-2 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-xs rounded-xl shadow-glow-red flex items-center space-x-1.5 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>Next Episode</span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"${_scopeId}></path></svg>`);
            } else {
              return [
                createVNode("span", null, "Next Episode"),
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
                    d: "M9 5l7 7-7 7"
                  })
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="w-full">`);
      _push(ssrRenderComponent(_component_PlaybackPlayer, {
        mediaType: "tv",
        tmdbId: unref(tvId),
        season: unref(seasonNumber),
        episode: unref(episodeNumber),
        title: (_a = unref(show)) == null ? void 0 : _a.name
      }, null, _parent));
      _push(`</div><div class="bg-marxi-850 rounded-2xl p-6 border border-marxi-800 space-y-6"><div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marxi-800 pb-4"><div><div class="flex items-center space-x-2 text-xs font-bold text-marxi-accent mb-1"><span>${ssrInterpolate(((_b = unref(show)) == null ? void 0 : _b.name) || "TV Series")}</span><span>\u2022</span><span>Season ${ssrInterpolate(unref(seasonNumber))}, Episode ${ssrInterpolate(unref(episodeNumber))}</span></div><h1 class="text-2xl sm:text-3xl font-display font-black text-white">${ssrInterpolate(((_c = unref(currentEpisode)) == null ? void 0 : _c.name) || `Episode ${unref(episodeNumber)}`)}</h1></div><div class="flex items-center space-x-2"><select class="bg-marxi-800 border border-marxi-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-marxi-accent"><!--[-->`);
      ssrRenderList((_e = (_d = unref(show)) == null ? void 0 : _d.seasons) == null ? void 0 : _e.filter((s) => s.season_number > 0), (s) => {
        _push(`<option${ssrRenderAttr("value", s.season_number)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSeason)) ? ssrLooseContain(unref(selectedSeason), s.season_number) : ssrLooseEqual(unref(selectedSeason), s.season_number)) ? " selected" : ""}> Season ${ssrInterpolate(s.season_number)} (${ssrInterpolate(s.episode_count)} Ep) </option>`);
      });
      _push(`<!--]--></select></div></div><div class="space-y-2"><h3 class="text-white font-bold text-sm">Episode Overview</h3><p class="text-gray-300 text-sm leading-relaxed">${ssrInterpolate(((_f = unref(currentEpisode)) == null ? void 0 : _f.overview) || ((_g = unref(show)) == null ? void 0 : _g.overview) || "No episode description available.")}</p></div>`);
      if (unref(seasonDetails) && unref(seasonDetails).episodes) {
        _push(`<div class="space-y-3 pt-4 border-t border-marxi-800"><h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider"> Season ${ssrInterpolate(unref(seasonNumber))} Episodes </h4><div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"><!--[-->`);
        ssrRenderList(unref(seasonDetails).episodes, (ep) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: ep.id,
            to: `/watch/tv/${unref(tvId)}/${unref(seasonNumber)}/${ep.episode_number}`,
            class: ["px-3 py-2 rounded-xl text-center text-xs font-semibold transition-all border", [
              ep.episode_number === unref(episodeNumber) ? "bg-marxi-accent text-white border-marxi-accent shadow-glow-red font-bold" : "bg-marxi-800 text-gray-300 border-marxi-700 hover:bg-marxi-700 hover:text-white"
            ]]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Ep ${ssrInterpolate(ep.episode_number)}`);
              } else {
                return [
                  createTextVNode(" Ep " + toDisplayString(ep.episode_number), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/watch/tv/[id]/[season]/[episode].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_episode_-b9KoSda1.mjs.map
