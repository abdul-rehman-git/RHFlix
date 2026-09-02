import { _ as _sfc_main$1 } from './LoadingSkeleton-B0CSl5DE.mjs';
import { _ as _sfc_main$2 } from './ContentCard-BrOWzjXi.mjs';
import { _ as _sfc_main$3 } from './EmptyState-DYrGJZan.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useSeoMeta, a as useHead } from './v3-BoNLv2pz.mjs';
import { c as useRoute, u as useTmdb } from './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Explore TV Series - RHFlix",
      ogTitle: "Explore TV Series - RHFlix",
      description: "Discover top rated series, trending shows, and season updates on RHFlix.",
      ogDescription: "Discover top rated series, trending shows, and season updates on RHFlix."
    });
    useHead({
      link: [
        { rel: "canonical", href: "https://reflix.rehmanwebs.com/tv" }
      ]
    });
    const route = useRoute();
    useTmdb();
    const currentSort = ref(route.query.sort || "popular");
    const selectedGenreId = ref(null);
    const items = ref([]);
    const genres = ref([]);
    const page = ref(1);
    const totalPages = ref(1);
    const loading = ref(true);
    const loadingMore = ref(false);
    const sortTabs = [
      { id: "popular", label: "Popular" },
      { id: "trending", label: "Trending" },
      { id: "top_rated", label: "Top Rated" },
      { id: "airing_today", label: "Airing Today" }
    ];
    const hasMore = computed(() => page.value < totalPages.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoadingSkeleton = _sfc_main$1;
      const _component_ContentCard = _sfc_main$2;
      const _component_EmptyState = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8" }, _attrs))}><div class="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border-b border-marxi-800 pb-5"><div><h1 class="text-2xl sm:text-4xl font-display font-black text-white tracking-tight"> Explore TV Shows </h1><p class="text-xs sm:text-sm text-gray-400 mt-1"> Discover top rated series, trending shows, and season updates on RHFlix. </p></div><div class="flex items-center space-x-1.5 sm:space-x-2 bg-marxi-850 p-1.5 rounded-2xl border border-marxi-800 overflow-x-auto hide-scrollbar"><!--[-->`);
      ssrRenderList(sortTabs, (tab) => {
        _push(`<button class="${ssrRenderClass([[
          unref(currentSort) === tab.id ? "bg-marxi-accent text-white shadow-glow-red" : "text-gray-400 hover:text-white hover:bg-marxi-800"
        ], "px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap min-h-[40px] flex items-center"])}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(genres).length > 0) {
        _push(`<div class="flex items-center space-x-2 overflow-x-auto hide-scrollbar py-1"><button class="${ssrRenderClass([[
          unref(selectedGenreId) === null ? "bg-white text-marxi-950 font-bold border-white" : "bg-marxi-850 text-gray-300 border-marxi-700 hover:border-gray-500"
        ], "px-3.5 py-2 rounded-full text-xs font-medium border transition-colors whitespace-nowrap min-h-[40px] flex items-center"])}"> All Genres </button><!--[-->`);
        ssrRenderList(unref(genres), (genre) => {
          _push(`<button class="${ssrRenderClass([[
            unref(selectedGenreId) === genre.id ? "bg-white text-marxi-950 font-bold border-white" : "bg-marxi-850 text-gray-300 border-marxi-700 hover:border-gray-500"
          ], "px-3.5 py-2 rounded-full text-xs font-medium border transition-colors whitespace-nowrap min-h-[40px] flex items-center"])}">${ssrInterpolate(genre.name)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading) && unref(items).length === 0) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-6"><!--[-->`);
        ssrRenderList(12, (i) => {
          _push(ssrRenderComponent(_component_LoadingSkeleton, {
            key: i,
            type: "card"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (unref(items).length > 0) {
        _push(`<div class="space-y-8 sm:space-y-10"><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-6"><!--[-->`);
        ssrRenderList(unref(items), (item) => {
          _push(ssrRenderComponent(_component_ContentCard, {
            key: `tv-${item.id}`,
            item: { ...item, media_type: "tv" },
            isGrid: true
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
        if (unref(hasMore)) {
          _push(`<div class="flex justify-center pt-4 sm:pt-6"><button${ssrIncludeBooleanAttr(unref(loadingMore)) ? " disabled" : ""} class="px-8 py-3 bg-marxi-800 hover:bg-marxi-700 text-white font-bold text-sm rounded-xl border border-white/10 flex items-center space-x-2 transition-colors disabled:opacity-50 min-h-[44px]">`);
          if (unref(loadingMore)) {
            _push(`<span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>${ssrInterpolate(unref(loadingMore) ? "Loading..." : "Load More TV Shows")}</span></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "No TV Series Found",
          description: "We couldn't find any TV shows matching the selected criteria."
        }, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tv/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CrDYvfWo.mjs.map
