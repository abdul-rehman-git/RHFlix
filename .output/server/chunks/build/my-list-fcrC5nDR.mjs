import { _ as _sfc_main$1 } from './ContentCard-BrOWzjXi.mjs';
import { _ as _sfc_main$2 } from './EmptyState-DYrGJZan.mjs';
import { d as useMyList, a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "my-list",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "My Watchlist - RHFlix",
      ogTitle: "My Watchlist - RHFlix",
      description: "View your saved movies and TV shows on RHFlix.",
      ogDescription: "View your saved movies and TV shows on RHFlix."
    });
    useHead({
      link: [
        { rel: "canonical", href: "https://reflix.rehmanwebs.com/my-list" }
      ]
    });
    const { myList } = useMyList();
    const activeFilter = ref("all");
    const filters = [
      { id: "all", label: "All Items" },
      { id: "movie", label: "Movies" },
      { id: "tv", label: "TV Series" }
    ];
    const savedItems = computed(() => myList.value || []);
    const filteredItems = computed(() => {
      if (activeFilter.value === "all") return savedItems.value;
      return savedItems.value.filter((item) => {
        const type = item.media_type || (item.title ? "movie" : "tv");
        return type === activeFilter.value;
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContentCard = _sfc_main$1;
      const _component_EmptyState = _sfc_main$2;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-marxi-800 pb-5"><div><h1 class="text-2xl sm:text-4xl font-display font-black text-white tracking-tight"> My List </h1><p class="text-xs sm:text-sm text-gray-400 mt-1"> Your personal collection of saved movies and TV series. </p></div>`);
      if (unref(savedItems).length > 0) {
        _push(`<div class="flex items-center space-x-2 bg-marxi-850 p-1.5 rounded-2xl border border-marxi-800"><!--[-->`);
        ssrRenderList(filters, (filter) => {
          _push(`<button class="${ssrRenderClass([[
            unref(activeFilter) === filter.id ? "bg-marxi-accent text-white shadow-glow-red" : "text-gray-400 hover:text-white hover:bg-marxi-800"
          ], "px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center"])}">${ssrInterpolate(filter.label)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(filteredItems).length > 0) {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-6"><!--[-->`);
        ssrRenderList(unref(filteredItems), (item) => {
          _push(ssrRenderComponent(_component_ContentCard, {
            key: `${item.media_type || "item"}-${item.id}`,
            item,
            isGrid: true
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: "Your List is Empty",
          description: "You haven't saved any movies or TV series to your list yet. Click the bookmark icon on any title to save it for later."
        }, {
          action: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/movies",
                class: "px-6 py-3 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-sm rounded-xl shadow-glow-red inline-flex items-center space-x-2 transition-all min-h-[44px]"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span${_scopeId2}>Explore Movies</span>`);
                  } else {
                    return [
                      createVNode("span", null, "Explore Movies")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_NuxtLink, {
                  to: "/movies",
                  class: "px-6 py-3 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-sm rounded-xl shadow-glow-red inline-flex items-center space-x-2 transition-all min-h-[44px]"
                }, {
                  default: withCtx(() => [
                    createVNode("span", null, "Explore Movies")
                  ]),
                  _: 1
                })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/my-list.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=my-list-fcrC5nDR.mjs.map
