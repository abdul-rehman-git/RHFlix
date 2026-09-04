import { _ as _sfc_main$1 } from './LoadingSkeleton-B0CSl5DE.mjs';
import { _ as _sfc_main$2 } from './ContentCard-BrOWzjXi.mjs';
import { _ as _sfc_main$3 } from './EmptyState-DYrGJZan.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { c as useRoute, e as useRouter, u as useTmdb } from './server.mjs';
import { u as useSeoMeta } from './v3-BoNLv2pz.mjs';
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
  __name: "search",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Search Movies & TV Shows - RHFlix",
      ogTitle: "Search Movies & TV Shows - RHFlix",
      description: "Search across millions of movies and TV series on RHFlix."
    });
    const route = useRoute();
    useRouter();
    useTmdb();
    ref(null);
    const searchQuery = ref(route.query.q || "");
    const activeFilter = ref("all");
    const rawResults = ref([]);
    const loading = ref(false);
    const typeFilters = [
      { id: "all", label: "All Results" },
      { id: "movie", label: "Movies" },
      { id: "tv", label: "TV Shows" }
    ];
    const filteredResults = computed(() => {
      if (activeFilter.value === "all") return rawResults.value;
      return rawResults.value.filter((item) => {
        const type = item.media_type || (item.title ? "movie" : "tv");
        return type === activeFilter.value;
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LoadingSkeleton = _sfc_main$1;
      const _component_ContentCard = _sfc_main$2;
      const _component_EmptyState = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8" }, _attrs))}><div class="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6"><div class="space-y-1 sm:space-y-2"><h1 class="text-2xl sm:text-5xl font-display font-black text-white tracking-tight"> Search Marxi </h1><p class="text-xs sm:text-sm text-gray-400"> Find millions of movies, TV shows, and trending series on Marxi. </p></div><div class="relative max-w-xl mx-auto"><input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Search for movies, TV series..." class="w-full bg-marxi-850 border border-marxi-700 text-sm sm:text-base text-white placeholder-gray-400 rounded-2xl py-3.5 sm:py-4 pl-11 pr-10 shadow-glow-card focus:outline-none focus:border-marxi-accent focus:ring-1 focus:ring-marxi-accent transition-all duration-300 min-h-[48px]"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>`);
      if (unref(searchQuery)) {
        _push(`<button class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center" aria-label="Clear Search"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(searchQuery)) {
        _push(`<div class="flex items-center justify-center space-x-2 pt-2"><!--[-->`);
        ssrRenderList(typeFilters, (filter) => {
          _push(`<button class="${ssrRenderClass([[
            unref(activeFilter) === filter.id ? "bg-marxi-accent text-white border-marxi-accent shadow-glow-red" : "bg-marxi-850 text-gray-300 border-marxi-700 hover:border-gray-500"
          ], "px-4 py-2 rounded-full text-xs font-bold transition-all border min-h-[40px] flex items-center"])}">${ssrInterpolate(filter.label)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-6"><!--[-->`);
        ssrRenderList(12, (i) => {
          _push(ssrRenderComponent(_component_LoadingSkeleton, {
            key: i,
            type: "card"
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else if (unref(filteredResults).length > 0) {
        _push(`<div class="space-y-4 sm:space-y-6"><div class="flex items-center justify-between text-xs text-gray-400 border-b border-marxi-800 pb-3"><span>Found ${ssrInterpolate(unref(filteredResults).length)} results for &quot;<strong class="text-white">${ssrInterpolate(unref(searchQuery))}</strong>&quot;</span></div><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-6"><!--[-->`);
        ssrRenderList(unref(filteredResults), (item) => {
          _push(ssrRenderComponent(_component_ContentCard, {
            key: `${item.media_type || "item"}-${item.id}`,
            item,
            isGrid: true
          }, null, _parent));
        });
        _push(`<!--]--></div></div>`);
      } else if (unref(searchQuery) && !unref(loading)) {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "No Results Found",
          description: `We couldn't find any content matching '${unref(searchQuery)}'. Try another search term.`
        }, null, _parent));
      } else {
        _push(`<div class="text-center py-12 sm:py-16 space-y-4"><div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-marxi-850 border border-marxi-700 flex items-center justify-center mx-auto text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></div><h3 class="font-display font-bold text-base sm:text-lg text-white">Start typing to search</h3><p class="text-xs text-gray-400 max-w-sm mx-auto"> Search for movie titles like &quot;Inception&quot;, &quot;Interstellar&quot;, or TV shows like &quot;Game of Thrones&quot;. </p></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/search.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=search-CD17lICZ.mjs.map
