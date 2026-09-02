import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "EmptyState",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center justify-center text-center py-16 px-4 space-y-4" }, _attrs))}><div class="w-16 h-16 rounded-full bg-marxi-800 border border-marxi-700 flex items-center justify-center text-gray-400">`);
      ssrRenderSlot(_ctx.$slots, "icon", {}, () => {
        _push(`<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>`);
      }, _push, _parent);
      _push(`</div><div class="max-w-md space-y-1"><h3 class="font-display font-bold text-xl text-white">${ssrInterpolate(__props.title)}</h3>`);
      if (__props.description) {
        _push(`<p class="text-sm text-gray-400 leading-relaxed">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (_ctx.$slots.action) {
        _push(`<div class="pt-2">`);
        ssrRenderSlot(_ctx.$slots, "action", {}, null, _push, _parent);
        _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EmptyState.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=EmptyState-DYrGJZan.mjs.map
