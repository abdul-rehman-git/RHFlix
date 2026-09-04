import { a as __nuxt_component_0$1 } from './server.mjs';
import { _ as _sfc_main$1 } from './ContentCard-BrOWzjXi.mjs';
import { _ as _sfc_main$2 } from './LoadingSkeleton-B0CSl5DE.mjs';
import { defineComponent, ref, mergeProps, withCtx, createVNode, openBlock, createBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ContentRow",
  __ssrInlineRender: true,
  props: {
    title: {},
    items: {},
    loading: { type: Boolean },
    viewAllUrl: {},
    layout: { default: "row" }
  },
  setup(__props) {
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_ContentCard = _sfc_main$1;
      const _component_LoadingSkeleton = _sfc_main$2;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-4 sm:py-6 relative group/row" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center justify-between mb-3 sm:mb-4"><div class="flex items-center space-x-2.5 sm:space-x-3"><div class="w-1.5 h-5 sm:h-6 bg-marxi-accent rounded-full"></div><h2 class="font-display text-lg sm:text-2xl font-bold text-white tracking-tight">${ssrInterpolate(__props.title)}</h2></div>`);
      if (__props.viewAllUrl) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: __props.viewAllUrl,
          class: "text-xs font-semibold text-gray-400 hover:text-marxi-accent flex items-center space-x-1 transition-colors py-1 px-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>View All</span><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"${_scopeId}></path></svg>`);
            } else {
              return [
                createVNode("span", null, "View All"),
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  class: "h-3.5 w-3.5",
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
      _push(`</div>`);
      if (__props.layout === "grid") {
        _push(`<div>`);
        if (__props.items && __props.items.length > 0) {
          _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6"><!--[-->`);
          ssrRenderList(__props.items, (item) => {
            _push(ssrRenderComponent(_component_ContentCard, {
              key: `${item.media_type || "item"}-${item.id}`,
              item,
              isGrid: true
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else if (__props.loading) {
          _push(`<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6"><!--[-->`);
          ssrRenderList(6, (i) => {
            _push(ssrRenderComponent(_component_LoadingSkeleton, {
              key: i,
              type: "card"
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="relative"><button class="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-marxi-950/90 text-white border border-marxi-700 items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-marxi-accent transition-all duration-300 shadow-lg" aria-label="Scroll Left"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></button><button class="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-marxi-950/90 text-white border border-marxi-700 items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-marxi-accent transition-all duration-300 shadow-lg" aria-label="Scroll Right"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button><div class="flex items-center space-x-3 sm:space-x-4 overflow-x-auto scroll-smooth hide-scrollbar py-2 px-1 snap-x snap-mandatory">`);
        if (__props.items && __props.items.length > 0) {
          _push(`<!--[-->`);
          ssrRenderList(__props.items, (item) => {
            _push(ssrRenderComponent(_component_ContentCard, {
              key: `${item.media_type || "item"}-${item.id}`,
              item
            }, null, _parent));
          });
          _push(`<!--]-->`);
        } else if (__props.loading) {
          _push(`<!--[-->`);
          ssrRenderList(6, (i) => {
            _push(ssrRenderComponent(_component_LoadingSkeleton, {
              key: i,
              type: "card"
            }, null, _parent));
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContentRow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ContentRow-CH0wMBvS.mjs.map
