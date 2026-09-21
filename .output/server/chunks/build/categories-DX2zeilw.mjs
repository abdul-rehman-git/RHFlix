import { _ as _sfc_main$1 } from './LoadingSkeleton-B0CSl5DE.mjs';
import { a as _sfc_main$2 } from './ContentCard-C9DSSU5M.mjs';
import { _ as _sfc_main$3 } from './EmptyState-DYrGJZan.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent } from 'vue/server-renderer';
import { c as useRoute, e as useRouter, u as useTmdb } from './server.mjs';
import { u as useSeoMeta, a as useHead } from './v3-BoNLv2pz.mjs';
import './useMediaRelease-BR9XhcFs.mjs';
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
  __name: "categories",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Categories & Regional Explore - RHFlix",
      ogTitle: "Categories & Regional Explore - RHFlix",
      description: "Browse K-Dramas, Anime, Action, Romance, Bollywood, Turkish, 18+ and top genres on RHFlix.",
      ogDescription: "Browse K-Dramas, Anime, Action, Romance, Bollywood, Turkish, 18+ and top genres on RHFlix.",
      ogUrl: "https://rhflix.rehmanwebs.com/categories",
      twitterCard: "summary_large_image"
    });
    useHead({
      link: [
        { rel: "canonical", href: "https://rhflix.rehmanwebs.com/categories" }
      ]
    });
    const route = useRoute();
    const router = useRouter();
    const { discoverMedia } = useTmdb();
    const PRESETS = [
      { id: "all", label: "All Content", icon: "\u{1F3AC}", type: "movie" },
      { id: "k-drama", label: "K-Dramas", icon: "\u{1F1F0}\u{1F1F7}", lang: "ko", type: "tv" },
      { id: "anime", label: "Anime", icon: "\u{1F1EF}\u{1F1F5}", lang: "ja", genre: 16, type: "tv" },
      { id: "bollywood", label: "Bollywood", icon: "\u{1F1EE}\u{1F1F3}", lang: "hi", type: "movie" },
      { id: "action", label: "Action", icon: "\u{1F4A5}", genre: 28, type: "movie" },
      { id: "romance", label: "Romance", icon: "\u{1F496}", genre: 10749, type: "movie" },
      { id: "scifi", label: "Sci-Fi", icon: "\u{1F680}", genre: 878, type: "movie" },
      { id: "turkish", label: "Turkish", icon: "\u{1F1F9}\u{1F1F7}", lang: "tr", type: "tv" },
      { id: "18plus", label: "18+ Mature", icon: "\u{1F51E}", adult: true, type: "movie" }
    ];
    const MEDIA_TYPES = [
      { id: "movie", label: "Movies" },
      { id: "tv", label: "TV Series" }
    ];
    const LANGUAGES = [
      { id: null, label: "All Languages", flag: "\u{1F310}" },
      { id: "ko", label: "Korean (K-Drama)", flag: "\u{1F1F0}\u{1F1F7}" },
      { id: "ja", label: "Japanese (Anime)", flag: "\u{1F1EF}\u{1F1F5}" },
      { id: "hi", label: "Hindi (Bollywood)", flag: "\u{1F1EE}\u{1F1F3}" },
      { id: "en", label: "English (Hollywood)", flag: "\u{1F1FA}\u{1F1F8}" },
      { id: "tr", label: "Turkish Serials", flag: "\u{1F1F9}\u{1F1F7}" }
    ];
    const selectedType = ref(route.query.type || "movie");
    const selectedLanguage = ref(route.query.lang || null);
    const selectedGenreId = ref(route.query.genre ? Number(route.query.genre) : null);
    const selectedSort = ref(route.query.sort || "popularity.desc");
    const includeAdult = ref(route.query.adult === "true");
    const showFiltersDrawer = ref(false);
    const items = ref([]);
    const allGenres = ref([]);
    const page = ref(1);
    const totalPages = ref(1);
    const loading = ref(true);
    const loadingMore = ref(false);
    const hasMore = computed(() => page.value < totalPages.value);
    const hasActiveFilters = computed(() => {
      return selectedLanguage.value !== null || selectedGenreId.value !== null || includeAdult.value;
    });
    const syncQueryParams = () => {
      const query = {};
      if (selectedType.value !== "movie") query.type = selectedType.value;
      if (selectedLanguage.value) query.lang = selectedLanguage.value;
      if (selectedGenreId.value) query.genre = selectedGenreId.value;
      if (selectedSort.value !== "popularity.desc") query.sort = selectedSort.value;
      if (includeAdult.value) query.adult = "true";
      router.replace({ query });
    };
    const fetchMedia = async (reset = true) => {
      if (reset) {
        page.value = 1;
        items.value = [];
        loading.value = true;
      } else {
        loadingMore.value = true;
      }
      syncQueryParams();
      try {
        const res = await discoverMedia({
          type: selectedType.value,
          genreId: selectedGenreId.value,
          language: selectedLanguage.value,
          sortBy: selectedSort.value,
          page: page.value,
          includeAdult: includeAdult.value,
          adultOnly: includeAdult.value
        });
        totalPages.value = res.total_pages;
        if (reset) {
          items.value = res.results || [];
        } else {
          items.value.push(...res.results || []);
        }
      } catch (err) {
        console.error("Error discovering media:", err);
        if (reset) items.value = [];
      } finally {
        loading.value = false;
        loadingMore.value = false;
      }
    };
    const isPresetActive = (preset) => {
      if (preset.id === "all") {
        return !selectedLanguage.value && !selectedGenreId.value && !includeAdult.value;
      }
      if (preset.lang && selectedLanguage.value !== preset.lang) return false;
      if (preset.genre && selectedGenreId.value !== preset.genre) return false;
      if (preset.adult && !includeAdult.value) return false;
      return true;
    };
    const resetFilters = () => {
      selectedLanguage.value = null;
      selectedGenreId.value = null;
      includeAdult.value = false;
      selectedSort.value = "popularity.desc";
      showFiltersDrawer.value = false;
      fetchMedia(true);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoadingSkeleton = _sfc_main$1;
      const _component_ContentCard = _sfc_main$2;
      const _component_EmptyState = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6" }, _attrs))}><div class="flex items-center justify-between gap-3 border-b border-marxi-800/80 pb-3"><div><h1 class="text-xl sm:text-3xl font-display font-black text-white tracking-tight flex items-center space-x-2"><span>Explore Categories</span><span class="text-xs px-2.5 py-0.5 rounded-full bg-marxi-accent/20 border border-marxi-accent/40 text-marxi-accent font-sans font-bold">${ssrInterpolate(unref(items).length)} Titles </span></h1><p class="text-xs text-gray-400 hidden sm:block mt-0.5"> Stream K-Dramas, Anime, Bollywood, Action, Romance, Turkish Serials &amp; 18+ Mature content. </p></div>`);
      if (unref(hasActiveFilters)) {
        _push(`<button class="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-marxi-850 hover:bg-marxi-800 text-marxi-gold text-xs font-bold rounded-xl border border-marxi-gold/30 transition-all shrink-0 min-h-[36px]"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg><span>Reset</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="sticky top-16 z-30 space-y-3 bg-marxi-950/90 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-white/10 shadow-2xl"><div class="flex items-center space-x-2 overflow-x-auto hide-scrollbar pb-1"><!--[-->`);
      ssrRenderList(PRESETS, (preset) => {
        _push(`<button class="${ssrRenderClass([[
          isPresetActive(preset) ? "bg-gradient-to-r from-marxi-accent to-red-700 text-white border-marxi-accent shadow-glow-red scale-[1.02]" : "bg-marxi-850/90 text-gray-300 border-marxi-800 hover:border-marxi-700 hover:text-white"
        ], "px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center space-x-1.5 min-h-[38px] shadow-sm"])}"><span>${ssrInterpolate(preset.icon)}</span><span>${ssrInterpolate(preset.label)}</span></button>`);
      });
      _push(`<!--]--></div><div class="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-marxi-800/60 text-xs"><div class="flex items-center space-x-1 bg-marxi-900 p-1 rounded-xl border border-marxi-800 shrink-0"><!--[-->`);
      ssrRenderList(MEDIA_TYPES, (t) => {
        _push(`<button class="${ssrRenderClass([[
          unref(selectedType) === t.id ? "bg-marxi-accent text-white font-black shadow-sm" : "text-gray-400 hover:text-white"
        ], "px-3 py-1 rounded-lg text-xs font-bold transition-all min-h-[32px]"])}">${ssrInterpolate(t.label)}</button>`);
      });
      _push(`<!--]--></div><div class="flex items-center space-x-2 overflow-x-auto hide-scrollbar"><button class="${ssrRenderClass([[
        unref(showFiltersDrawer) || unref(selectedGenreId) || unref(selectedLanguage) ? "bg-marxi-gold text-black border-marxi-gold" : "bg-marxi-850 text-gray-300 border-marxi-800 hover:text-white"
      ], "px-3 py-1.5 rounded-xl border font-bold flex items-center space-x-1.5 min-h-[34px] transition-colors shrink-0"])}"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg><span>Filters</span>`);
      if (unref(selectedGenreId) || unref(selectedLanguage)) {
        _push(`<span class="w-2 h-2 rounded-full bg-black"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><select class="bg-marxi-850 border border-marxi-800 text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-marxi-accent min-h-[34px]"><option value="popularity.desc"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSort)) ? ssrLooseContain(unref(selectedSort), "popularity.desc") : ssrLooseEqual(unref(selectedSort), "popularity.desc")) ? " selected" : ""}>\u{1F525} Most Popular</option><option value="vote_average.desc"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSort)) ? ssrLooseContain(unref(selectedSort), "vote_average.desc") : ssrLooseEqual(unref(selectedSort), "vote_average.desc")) ? " selected" : ""}>\u2B50 Top Rated</option><option value="primary_release_date.desc"${ssrIncludeBooleanAttr(Array.isArray(unref(selectedSort)) ? ssrLooseContain(unref(selectedSort), "primary_release_date.desc") : ssrLooseEqual(unref(selectedSort), "primary_release_date.desc")) ? " selected" : ""}>\u{1F4C5} Latest</option></select><label class="flex items-center space-x-1.5 cursor-pointer bg-marxi-850 hover:bg-marxi-800 px-3 py-1.5 rounded-xl border border-marxi-800 transition-colors shrink-0 min-h-[34px]"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(includeAdult)) ? ssrLooseContain(unref(includeAdult), null) : unref(includeAdult)) ? " checked" : ""} class="w-3.5 h-3.5 accent-marxi-accent rounded cursor-pointer"><span class="font-bold text-red-400 text-xs flex items-center space-x-1"><span>\u{1F51E}</span><span class="hidden xs:inline">18+</span></span></label></div></div>`);
      if (unref(showFiltersDrawer)) {
        _push(`<div class="pt-3 border-t border-marxi-800/80 space-y-3 text-xs animate-fadeIn"><div class="space-y-1.5"><span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Languages &amp; Regions</span><div class="flex items-center space-x-1.5 overflow-x-auto hide-scrollbar pb-1"><!--[-->`);
        ssrRenderList(LANGUAGES, (lang) => {
          _push(`<button class="${ssrRenderClass([[
            unref(selectedLanguage) === lang.id ? "bg-marxi-gold text-black border-marxi-gold font-bold" : "bg-marxi-900 text-gray-300 border-marxi-800 hover:text-white"
          ], "px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all border flex items-center space-x-1"])}"><span>${ssrInterpolate(lang.flag)}</span><span>${ssrInterpolate(lang.label)}</span></button>`);
        });
        _push(`<!--]--></div></div><div class="space-y-1.5"><span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Genres</span><div class="flex items-center space-x-1.5 overflow-x-auto hide-scrollbar pb-1"><button class="${ssrRenderClass([[
          unref(selectedGenreId) === null ? "bg-white text-black font-bold border-white" : "bg-marxi-900 text-gray-300 border-marxi-800 hover:text-white"
        ], "px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all border"])}"> All Genres </button><!--[-->`);
        ssrRenderList(unref(allGenres), (genre) => {
          _push(`<button class="${ssrRenderClass([[
            unref(selectedGenreId) === genre.id ? "bg-marxi-accent text-white font-bold border-marxi-accent" : "bg-marxi-900 text-gray-300 border-marxi-800 hover:text-white"
          ], "px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all border"])}">${ssrInterpolate(genre.name)}</button>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(loading) && unref(items).length === 0) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5"><!--[-->`);
        ssrRenderList(12, (i) => {
          _push(ssrRenderComponent(_component_LoadingSkeleton, {
            key: i,
            type: "card"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (unref(items).length > 0) {
        _push(`<div class="space-y-6 sm:space-y-8"><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5"><!--[-->`);
        ssrRenderList(unref(items), (item) => {
          _push(ssrRenderComponent(_component_ContentCard, {
            key: `${item.media_type || unref(selectedType)}-${item.id}`,
            item: { ...item, media_type: item.media_type || unref(selectedType) },
            isGrid: true
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
        if (unref(hasMore)) {
          _push(`<div class="flex justify-center pt-2 sm:pt-4"><button${ssrIncludeBooleanAttr(unref(loadingMore)) ? " disabled" : ""} class="px-6 py-3 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-xs rounded-xl shadow-glow-red flex items-center space-x-2 transition-all disabled:opacity-50 min-h-[40px]">`);
          if (unref(loadingMore)) {
            _push(`<span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>${ssrInterpolate(unref(loadingMore) ? "Loading More Titles..." : "Load More Results")}</span></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "No Titles Found",
          description: "We couldn't find any content matching your selected categories. Try resetting filters."
        }, {
          action: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button class="px-6 py-2.5 bg-marxi-accent text-white font-bold text-xs rounded-xl shadow-glow-red min-h-[40px]"${_scopeId}> Reset All Filters </button>`);
            } else {
              return [
                createVNode("button", {
                  onClick: resetFilters,
                  class: "px-6 py-2.5 bg-marxi-accent text-white font-bold text-xs rounded-xl shadow-glow-red min-h-[40px]"
                }, " Reset All Filters ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/categories.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=categories-DX2zeilw.mjs.map
