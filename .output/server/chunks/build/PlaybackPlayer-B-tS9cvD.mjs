import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';

const getMoviePlaybackUrl = (provider, tmdbId, lang = "en") => {
  const id = String(tmdbId);
  const langParam = lang === "hi" ? "&ds_lang=hi&lang=hi&audio=hi" : "";
  switch (provider) {
    case "vidphantom":
      return `https://vidphantom.com/movie/${id}?lang=${lang}`;
    case "embed-api-stream":
    default:
      return `https://watch.embed-api.stream/embed/movie/${id}?hidetitle=1&title=0${langParam}`;
  }
};
const getEpisodePlaybackUrl = (provider, tmdbId, season = 1, episode = 1, lang = "en") => {
  const id = String(tmdbId);
  const s = String(season);
  const e = String(episode);
  const langParam = lang === "hi" ? "&ds_lang=hi&lang=hi&audio=hi" : "";
  switch (provider) {
    case "vidphantom":
      return `https://vidphantom.com/tv/${id}/${s}/${e}?lang=${lang}`;
    case "embed-api-stream":
    default:
      return `https://watch.embed-api.stream/embed/tv/${id}/${s}/${e}?hidetitle=1&title=0${langParam}`;
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PlaybackPlayer",
  __ssrInlineRender: true,
  props: {
    mediaType: {},
    tmdbId: {},
    season: { default: 1 },
    episode: { default: 1 },
    title: {}
  },
  setup(__props) {
    const props = __props;
    const selectedProviderId = ref("embed-api-stream");
    const loading = ref(true);
    const hasError = ref(false);
    const currentEmbedUrl = computed(() => {
      if (!props.tmdbId) return "";
      if (props.mediaType === "movie") {
        return getMoviePlaybackUrl(selectedProviderId.value, props.tmdbId);
      } else {
        return getEpisodePlaybackUrl(
          selectedProviderId.value,
          props.tmdbId,
          props.season || 1,
          props.episode || 1
        );
      }
    });
    watch(
      () => [props.tmdbId, props.season, props.episode, props.mediaType],
      () => {
        loading.value = true;
        hasError.value = false;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full" }, _attrs))}><div class="relative w-full aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border-y sm:border border-marxi-800/80 group">`);
      if (unref(loading)) {
        _push(`<div class="absolute top-0 left-0 right-0 h-1 bg-marxi-accent animate-pulse z-20"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(hasError)) {
        _push(`<div class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-marxi-950 text-white p-6 text-center space-y-4"><div class="w-14 h-14 rounded-full bg-red-500/10 text-marxi-accent border border-marxi-accent/30 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div class="max-w-md space-y-2"><h3 class="font-display font-bold text-xl text-white">Playback Interrupted</h3><p class="text-sm text-gray-400"> Having trouble loading this stream? Try switching to alternative server source. </p></div><div class="flex items-center space-x-3"><button class="px-6 py-3 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-sm rounded-xl shadow-glow-red transition-all"> Switch to ${ssrInterpolate(unref(selectedProviderId) === "embed-api-stream" ? "VidPhantom" : "Embed API Stream")}</button><button class="px-5 py-3 bg-marxi-800 hover:bg-marxi-700 text-white font-semibold text-sm rounded-xl border border-white/10 transition-colors"> Retry </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(currentEmbedUrl)) {
        _push(`<iframe${ssrRenderAttr("src", unref(currentEmbedUrl))} class="w-full h-full border-0" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen; encrypted-media; picture-in-picture"></iframe>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PlaybackPlayer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=PlaybackPlayer-B-tS9cvD.mjs.map
