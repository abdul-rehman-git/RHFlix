import { a as __nuxt_component_0$1 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ErrorState",
  __ssrInlineRender: true,
  props: {
    title: {},
    message: {},
    retry: { type: Function }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center justify-center text-center py-16 px-4 space-y-4" }, _attrs))}><div class="w-16 h-16 rounded-full bg-red-500/10 text-marxi-accent border border-marxi-accent/30 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="max-w-md space-y-2"><h3 class="font-display font-bold text-xl text-white">${ssrInterpolate(__props.title || "Error Loading Content")}</h3><p class="text-sm text-gray-400 leading-relaxed">${ssrInterpolate(__props.message || "An unexpected error occurred while communicating with TMDB or streaming services.")}</p></div><div class="pt-2 flex items-center space-x-3">`);
      if (__props.retry) {
        _push(`<button class="px-5 py-2.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-sm rounded-xl shadow-glow-red transition-all"> Try Again </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "px-5 py-2.5 bg-marxi-800 hover:bg-marxi-700 text-white font-semibold text-sm rounded-xl border border-white/10 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Back to Home `);
          } else {
            return [
              createTextVNode(" Back to Home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ErrorState.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TrailerModal",
  __ssrInlineRender: true,
  props: {
    isOpen: { type: Boolean },
    videoKey: {},
    title: {}
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.isOpen) {
          _push2(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"><div class="relative w-full max-w-4xl bg-marxi-950 rounded-2xl sm:rounded-3xl border border-marxi-800 shadow-2xl overflow-hidden flex flex-col"><div class="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-marxi-800/80 bg-marxi-900/60"><div class="flex items-center space-x-2.5 min-w-0 pr-4"><div class="w-2 h-2 rounded-full bg-marxi-accent animate-pulse"></div><h3 class="font-display font-bold text-sm sm:text-lg text-white truncate">${ssrInterpolate(__props.title ? `Trailer: ${__props.title}` : "Official Trailer")}</h3></div><button class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-marxi-850 hover:bg-marxi-800 text-gray-300 hover:text-white border border-marxi-700 flex items-center justify-center transition-colors shrink-0 shadow-md min-h-[36px] min-w-[36px]" aria-label="Close Trailer"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="relative w-full aspect-video bg-black overflow-hidden">`);
          if (__props.videoKey) {
            _push2(`<iframe${ssrRenderAttr("src", `https://www.youtube-nocookie.com/embed/${__props.videoKey}?autoplay=1&rel=0`)} title="Official Trailer" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`);
          } else {
            _push2(`<div class="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><p class="text-sm font-medium">Trailer video unavailable for this title.</p></div>`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TrailerModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$1 as _, _sfc_main as a };
//# sourceMappingURL=TrailerModal-ZNgHDUFO.mjs.map
