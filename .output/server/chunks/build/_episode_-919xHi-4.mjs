import { c as useRoute, e as useRouter, u as useTmdb, a as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './PlaybackPlayer-Q3GyOdp2.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, openBlock, createBlock, createVNode, createTextVNode, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { u as useWatchHistory } from './useWatchHistory-CR_x5umr.mjs';
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
  __name: "[episode]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const tvId = computed(() => route.params.id);
    const seasonNumber = computed(() => Number(route.params.season) || 1);
    const episodeNumber = computed(() => Number(route.params.episode) || 1);
    const { getTVDetails, getSeasonDetails, getVideos, getImageUrl } = useTmdb();
    const { addWatchHistory } = useWatchHistory();
    const { isComingSoon, formatReleaseDate } = useMediaRelease();
    const show = ref(null);
    const loadingShow = ref(true);
    const seasonDetails = ref(null);
    const selectedSeason = ref(seasonNumber.value);
    const trailerKey = ref(null);
    const currentEpisode = computed(() => {
      var _a;
      return (_a = seasonDetails.value) == null ? void 0 : _a.episodes.find((e) => e.episode_number === episodeNumber.value);
    });
    const isShowUnreleased = computed(() => isComingSoon(show.value));
    const isEpisodeUnreleased = computed(() => isComingSoon(currentEpisode.value));
    const isUnreleased = computed(() => isShowUnreleased.value || isEpisodeUnreleased.value);
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
      var _a, _b, _c, _d, _e;
      loadingShow.value = true;
      try {
        const [tvData, sData, vidRes] = await Promise.all([
          getTVDetails(tvId.value),
          getSeasonDetails(tvId.value, seasonNumber.value),
          getVideos("tv", tvId.value).catch(() => [])
        ]);
        show.value = tvData;
        seasonDetails.value = sData;
        selectedSeason.value = seasonNumber.value;
        const videos = Array.isArray(vidRes) ? vidRes : [];
        const trailer = videos.find((v) => v.site === "YouTube" && (v.type === "Trailer" || v.official || v.type === "Teaser"));
        trailerKey.value = trailer ? trailer.key : ((_a = videos[0]) == null ? void 0 : _a.key) || null;
        const epName = ((_b = currentEpisode.value) == null ? void 0 : _b.name) || `Episode ${episodeNumber.value}`;
        if (show.value) {
          const pageTitle = isUnreleased.value ? `Coming Soon: ${show.value.name} S${seasonNumber.value} E${episodeNumber.value} - RHFlix` : `Watching ${show.value.name} S${seasonNumber.value} E${episodeNumber.value} (${epName}) - RHFlix`;
          useSeoMeta({
            title: pageTitle,
            ogTitle: pageTitle,
            description: ((_c = currentEpisode.value) == null ? void 0 : _c.overview) || show.value.overview,
            ogDescription: ((_d = currentEpisode.value) == null ? void 0 : _d.overview) || show.value.overview,
            ogUrl: `https://rhflix.rehmanwebs.com/watch/tv/${show.value.id}/${seasonNumber.value}/${episodeNumber.value}`
          });
          useHead({
            link: [
              { rel: "canonical", href: `https://rhflix.rehmanwebs.com/watch/tv/${show.value.id}/${seasonNumber.value}/${episodeNumber.value}` }
            ]
          });
          if (!isUnreleased.value) {
            addWatchHistory({
              tmdbId: show.value.id,
              type: "tv",
              title: show.value.name,
              posterPath: show.value.poster_path,
              backdropPath: ((_e = currentEpisode.value) == null ? void 0 : _e.still_path) || show.value.backdrop_path,
              season: seasonNumber.value,
              episode: episodeNumber.value,
              episodeName: epName
            });
          }
        }
      } catch (err) {
        console.error("Error fetching watch TV data:", err);
      } finally {
        loadingShow.value = false;
      }
    };
    watch(() => [tvId.value, seasonNumber.value, episodeNumber.value], () => {
      loadShowAndSeasonData();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_PlaybackPlayer = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-3"><div class="flex items-center space-x-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/tv/${unref(tvId)}`,
        class: "inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-marxi-850 hover:bg-marxi-800 px-3.5 py-2.5 rounded-xl border border-marxi-800 transition-colors"
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
      if (unref(isUnreleased)) {
        _push(`<span class="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-lg uppercase font-black text-[10px] tracking-wider shadow-md flex items-center space-x-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-current" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg><span>Coming Soon</span></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center space-x-2">`);
      if (unref(hasPrevEpisode)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(prevEpisodeUrl),
          class: "px-3.5 py-2.5 bg-marxi-850 hover:bg-marxi-800 text-white font-semibold text-xs rounded-xl border border-marxi-800 flex items-center space-x-1.5 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"${_scopeId}></path></svg><span${_scopeId}>Prev Ep</span>`);
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
                createVNode("span", null, "Prev Ep")
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
          class: "px-3.5 py-2.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-xs rounded-xl shadow-glow-red flex items-center space-x-1.5 transition-all"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>Next Ep</span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"${_scopeId}></path></svg>`);
            } else {
              return [
                createVNode("span", null, "Next Ep"),
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
      _push(`</div></div><div class="-mx-3 sm:mx-0">`);
      if (unref(loadingShow)) {
        _push(`<div class="relative w-full aspect-video bg-marxi-950 rounded-none sm:rounded-2xl overflow-hidden border border-marxi-800 flex flex-col items-center justify-center p-6 text-center space-y-3"><div class="w-10 h-10 border-3 border-marxi-accent/30 border-t-marxi-accent rounded-full animate-spin"></div><p class="text-xs text-gray-400 font-semibold">Verifying episode air status...</p></div>`);
      } else if (unref(isUnreleased)) {
        _push(`<div class="space-y-4">`);
        if (unref(trailerKey)) {
          _push(`<div class="relative w-full aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40"><iframe${ssrRenderAttr("src", `https://www.youtube-nocookie.com/embed/${unref(trailerKey)}?autoplay=1&rel=0`)} class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`);
        } else {
          _push(`<div class="relative w-full aspect-video bg-marxi-950 rounded-none sm:rounded-2xl overflow-hidden border border-amber-500/30 flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-2xl">`);
          if (((_a = unref(currentEpisode)) == null ? void 0 : _a.still_path) || ((_b = unref(show)) == null ? void 0 : _b.backdrop_path)) {
            _push(`<img${ssrRenderAttr("src", unref(getImageUrl)(((_c = unref(currentEpisode)) == null ? void 0 : _c.still_path) || ((_d = unref(show)) == null ? void 0 : _d.backdrop_path), "original"))}${ssrRenderAttr("alt", (_e = unref(show)) == null ? void 0 : _e.name)} class="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm">`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="relative z-10 w-16 h-16 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="relative z-10 max-w-md space-y-2"><h2 class="text-xl sm:text-2xl font-display font-black text-white tracking-tight">${ssrInterpolate(unref(isShowUnreleased) ? "This TV Series Has Not Aired Yet" : "This Episode Has Not Aired Yet")}</h2><p class="text-xs sm:text-sm text-gray-300 leading-relaxed"> Scheduled air date: <strong class="text-amber-400">${ssrInterpolate(unref(formatReleaseDate)(unref(isShowUnreleased) ? unref(show) : unref(currentEpisode)))}</strong>. Streaming playback will unlock once officially broadcast. </p></div></div>`);
        }
        _push(`<div class="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200"><div class="flex items-center space-x-2.5"><span class="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0"></span><span>`);
        if (unref(trailerKey)) {
          _push(`<!--[-->\u{1F3AC} Playing the <strong>Official Trailer</strong>. <!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`Streaming playback will be available on release (<strong>${ssrInterpolate(unref(formatReleaseDate)(unref(isShowUnreleased) ? unref(show) : unref(currentEpisode)))}</strong>). </span></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tv/${unref(tvId)}`,
          class: "px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-colors shrink-0 text-center"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View Series Details `);
            } else {
              return [
                createTextVNode(" View Series Details ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else if (unref(show)) {
        _push(ssrRenderComponent(_component_PlaybackPlayer, {
          mediaType: "tv",
          tmdbId: unref(tvId),
          season: unref(seasonNumber),
          episode: unref(episodeNumber),
          title: unref(show).name,
          posterPath: unref(show).poster_path,
          backdropPath: ((_f = unref(currentEpisode)) == null ? void 0 : _f.still_path) || unref(show).backdrop_path,
          episodeName: (_g = unref(currentEpisode)) == null ? void 0 : _g.name
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-marxi-850 rounded-2xl p-4 sm:p-6 border border-marxi-800 space-y-4 shadow-xl"><div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-marxi-800 pb-4"><div><div class="flex items-center space-x-2 text-xs font-bold text-marxi-accent mb-1"><span>${ssrInterpolate(((_h = unref(show)) == null ? void 0 : _h.name) || "TV Series")}</span><span>\u2022</span><span>Season ${ssrInterpolate(unref(seasonNumber))}, Episode ${ssrInterpolate(unref(episodeNumber))}</span></div><h1 class="text-xl sm:text-3xl font-display font-black text-white">${ssrInterpolate(((_i = unref(currentEpisode)) == null ? void 0 : _i.name) || `Episode ${unref(episodeNumber)}`)}</h1></div><div class="flex items-center space-x-2"><select class="bg-marxi-800 border border-marxi-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-marxi-accent"><!--[-->`);
      ssrRenderList((_k = (_j = unref(show)) == null ? void 0 : _j.seasons) == null ? void 0 : _k.filter((s) => s.season_number > 0), (s) => {
        _push(`<option${ssrRenderAttr("value", s.season_number)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSeason)) ? ssrLooseContain(unref(selectedSeason), s.season_number) : ssrLooseEqual(unref(selectedSeason), s.season_number)) ? " selected" : ""}> Season ${ssrInterpolate(s.season_number)} (${ssrInterpolate(s.episode_count)} Ep) </option>`);
      });
      _push(`<!--]--></select></div></div><div class="space-y-1"><h3 class="text-white font-bold text-xs sm:text-sm">Episode Overview</h3><p class="text-gray-300 text-xs sm:text-sm leading-relaxed">${ssrInterpolate(((_l = unref(currentEpisode)) == null ? void 0 : _l.overview) || ((_m = unref(show)) == null ? void 0 : _m.overview) || "No episode description available.")}</p></div>`);
      if (unref(seasonDetails) && unref(seasonDetails).episodes) {
        _push(`<div class="space-y-2 pt-3 border-t border-marxi-800"><h4 class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider"> Season ${ssrInterpolate(unref(seasonNumber))} Episodes </h4><div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"><!--[-->`);
        ssrRenderList(unref(seasonDetails).episodes, (ep) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: ep.id,
            to: `/watch/tv/${unref(tvId)}/${unref(seasonNumber)}/${ep.episode_number}`,
            class: ["px-3 py-2 rounded-xl text-center text-xs font-semibold transition-all border flex items-center justify-center space-x-1", [
              ep.episode_number === unref(episodeNumber) ? "bg-marxi-accent text-white border-marxi-accent shadow-glow-red font-bold" : unref(isComingSoon)(ep) ? "bg-marxi-900/60 text-amber-400/80 border-amber-500/20 hover:border-amber-500/50" : "bg-marxi-800 text-gray-300 border-marxi-700 hover:bg-marxi-700 hover:text-white"
            ]]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<span${_scopeId}>Ep ${ssrInterpolate(ep.episode_number)}</span>`);
                if (unref(isComingSoon)(ep)) {
                  _push2(`<span class="w-1.5 h-1.5 rounded-full bg-amber-400" title="Coming Soon"${_scopeId}></span>`);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode("span", null, "Ep " + toDisplayString(ep.episode_number), 1),
                  unref(isComingSoon)(ep) ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "w-1.5 h-1.5 rounded-full bg-amber-400",
                    title: "Coming Soon"
                  })) : createCommentVNode("", true)
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
//# sourceMappingURL=_episode_-919xHi-4.mjs.map
