import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { u as useWatchHistory } from './useWatchHistory-CsbYpDkF.mjs';
import { c as useRoute } from './server.mjs';

const PLAYBACK_PROVIDERS = [
  {
    id: "vidcore",
    name: "VidCore",
    label: "Server 1 (VidCore)",
    priority: 1,
    isPrimary: true,
    supportsMovie: true,
    supportsTV: true,
    supportsPostMessage: true
  },
  {
    id: "vidphantom",
    name: "VidPhantom",
    label: "Server 2 (VidPhantom)",
    priority: 2,
    supportsMovie: true,
    supportsTV: true,
    supportsPostMessage: true
  },
  {
    id: "nexstream",
    name: "NexStream",
    label: "Server 3 (NexStream)",
    priority: 3,
    supportsMovie: true,
    supportsTV: true,
    supportsPostMessage: true
  },
  {
    id: "vidsrc-hair",
    name: "VidSrc Hair",
    label: "Server 4 (VidSrc Hair)",
    priority: 4,
    supportsMovie: true,
    supportsTV: true,
    supportsPostMessage: false
  }
];
const getProviderById = (id) => {
  return PLAYBACK_PROVIDERS.find((p) => p.id === id) || PLAYBACK_PROVIDERS[0];
};
const getNextProvider = (currentId, failedIds) => {
  const failedSet = failedIds instanceof Set ? failedIds : new Set(failedIds);
  const remaining = PLAYBACK_PROVIDERS.filter((p) => !failedSet.has(p.id)).sort((a, b) => a.priority - b.priority);
  return remaining.length > 0 ? remaining[0] : null;
};
const buildMoviePlaybackUrl = (providerId, tmdbId, defaultLang, useMirror = false) => {
  const id = String(tmdbId);
  switch (providerId) {
    case "vidcore": {
      const baseUrl = useMirror ? `https://vidlink.pro/movie/${id}` : `https://vidcore.org/embed/movie/${id}`;
      const url = new URL(baseUrl);
      if (defaultLang) {
        url.searchParams.set("lang", defaultLang);
      }
      return url.toString();
    }
    case "vidphantom": {
      const baseUrl = useMirror ? `https://vidsrc.cc/v2/embed/movie/${id}` : `https://vidphantom.com/movie/${id}`;
      const url = new URL(baseUrl);
      if (defaultLang) {
        url.searchParams.set("lang", defaultLang);
      }
      return url.toString();
    }
    case "nexstream": {
      const baseUrl = useMirror ? `https://embed.su/embed/movie/${id}` : `https://watch.embed-api.stream/embed/movie/${id}`;
      const url = new URL(baseUrl);
      if (!useMirror) {
        url.searchParams.set("hidetitle", "1");
        url.searchParams.set("title", "0");
        if (defaultLang) {
          url.searchParams.set("lang", defaultLang);
        }
      }
      return url.toString();
    }
    case "vidsrc-hair":
    default: {
      if (useMirror) {
        const url = new URL("https://vidsrc.me/embed/movie");
        url.searchParams.set("tmdb", id);
        return url.toString();
      }
      return `https://vidsrc.hair/embed/movie/${id}`;
    }
  }
};
const buildEpisodePlaybackUrl = (providerId, tmdbId, season = 1, episode = 1, defaultLang, useMirror = false) => {
  const id = String(tmdbId);
  const s = String(season);
  const e = String(episode);
  switch (providerId) {
    case "vidcore": {
      const baseUrl = useMirror ? `https://vidlink.pro/tv/${id}/${s}/${e}` : `https://vidcore.org/embed/tv/${id}/${s}/${e}`;
      const url = new URL(baseUrl);
      if (defaultLang) {
        url.searchParams.set("lang", defaultLang);
      }
      return url.toString();
    }
    case "vidphantom": {
      const baseUrl = useMirror ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` : `https://vidphantom.com/tv/${id}/${s}/${e}`;
      const url = new URL(baseUrl);
      if (defaultLang) {
        url.searchParams.set("lang", defaultLang);
      }
      return url.toString();
    }
    case "nexstream": {
      const baseUrl = useMirror ? `https://embed.su/embed/tv/${id}/${s}/${e}` : `https://watch.embed-api.stream/embed/tv/${id}/${s}/${e}`;
      const url = new URL(baseUrl);
      if (!useMirror) {
        url.searchParams.set("hidetitle", "1");
        url.searchParams.set("title", "0");
        if (defaultLang) {
          url.searchParams.set("lang", defaultLang);
        }
      }
      return url.toString();
    }
    case "vidsrc-hair":
    default: {
      if (useMirror) {
        const url = new URL("https://vidsrc.me/embed/tv");
        url.searchParams.set("tmdb", id);
        url.searchParams.set("season", s);
        url.searchParams.set("episode", e);
        return url.toString();
      }
      return `https://vidsrc.hair/embed/tv/${id}/${s}/${e}`;
    }
  }
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PlaybackPlayer",
  __ssrInlineRender: true,
  props: {
    mediaType: {},
    tmdbId: {},
    season: {},
    episode: {},
    title: {},
    posterPath: {},
    backdropPath: {},
    episodeName: {},
    defaultLang: {}
  },
  setup(__props) {
    const props = __props;
    const route = useRoute();
    useWatchHistory();
    const mode = ref("auto");
    const selectedProviderId = ref("vidcore");
    const userSelectedLang = ref(void 0);
    const isUsingMirror = ref(false);
    const failedProviders = ref(/* @__PURE__ */ new Set());
    const currentState = ref("LOADING");
    ref(null);
    let fallbackGraceTimer = null;
    const activeProvider = computed(() => getProviderById(selectedProviderId.value));
    const requestedLang = computed(() => {
      return userSelectedLang.value !== void 0 ? userSelectedLang.value : props.defaultLang || route.query.lang || void 0;
    });
    const currentEmbedUrl = computed(() => {
      if (!props.tmdbId) return "";
      const lang = requestedLang.value;
      if (props.mediaType === "movie") {
        return buildMoviePlaybackUrl(selectedProviderId.value, props.tmdbId, lang, isUsingMirror.value);
      } else {
        return buildEpisodePlaybackUrl(
          selectedProviderId.value,
          props.tmdbId,
          props.season || 1,
          props.episode || 1,
          lang,
          isUsingMirror.value
        );
      }
    });
    const isProviderFailed = (id) => {
      return failedProviders.value.has(id);
    };
    const startGraceTimer = () => {
      if (fallbackGraceTimer) clearTimeout(fallbackGraceTimer);
      fallbackGraceTimer = setTimeout(() => {
        if (currentState.value === "LOADING" || currentState.value === "FALLBACK") {
          if (!isUsingMirror.value) {
            isUsingMirror.value = true;
            startGraceTimer();
          } else {
            triggerFatalProviderFailure(selectedProviderId.value);
          }
        }
      }, 7e3);
    };
    const clearGraceTimer = () => {
      if (fallbackGraceTimer) {
        clearTimeout(fallbackGraceTimer);
        fallbackGraceTimer = null;
      }
    };
    const triggerFatalProviderFailure = (failedId, reason) => {
      clearGraceTimer();
      failedProviders.value.add(failedId);
      isUsingMirror.value = false;
      const next = getNextProvider(failedId, failedProviders.value);
      if (next && mode.value === "auto") {
        currentState.value = "FALLBACK";
        selectedProviderId.value = next.id;
        startGraceTimer();
      } else {
        currentState.value = "FINAL_ERROR";
      }
    };
    watch(
      () => [props.tmdbId, props.season, props.episode, props.mediaType],
      () => {
        failedProviders.value.clear();
        isUsingMirror.value = false;
        currentState.value = "LOADING";
        startGraceTimer();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full space-y-3" }, _attrs))}><div class="flex flex-col gap-2.5 bg-marxi-850 p-2.5 sm:p-3 rounded-2xl border border-marxi-800 shadow-lg"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"><div class="flex items-center space-x-2 shrink-0"><span class="${ssrRenderClass([
        "w-2.5 h-2.5 rounded-full transition-all duration-300",
        unref(currentState) === "PLAYING" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" : unref(currentState) === "LOADING" || unref(currentState) === "FALLBACK" ? "bg-amber-500 animate-spin" : unref(currentState) === "FINAL_ERROR" ? "bg-red-500" : "bg-gray-500"
      ])}"></span><span class="text-xs font-bold text-gray-200 tracking-wide"> Streaming Server: </span><span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-marxi-800 text-marxi-gold border border-marxi-gold/20">${ssrInterpolate(unref(mode) === "auto" ? "Auto (" + unref(activeProvider).name + ")" : unref(activeProvider).name)} `);
      if (unref(isUsingMirror)) {
        _push(`<!--[--> (Mirror)<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span></div><div class="flex items-center space-x-1.5 overflow-x-auto hide-scrollbar pb-0.5 sm:pb-0"><button class="${ssrRenderClass([
        "px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1 shrink-0 border min-h-[36px]",
        unref(mode) === "auto" ? "bg-marxi-gold text-black border-marxi-gold font-bold scale-[1.02] shadow-md" : "bg-marxi-800 text-gray-300 border-marxi-700/80 hover:bg-marxi-700 hover:text-white"
      ])}"><span>\u26A1 Auto</span></button><!--[-->`);
      ssrRenderList(unref(PLAYBACK_PROVIDERS), (provider) => {
        _push(`<button class="${ssrRenderClass([
          "px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 shrink-0 border min-h-[36px]",
          unref(mode) === "manual" && unref(selectedProviderId) === provider.id ? "bg-marxi-accent text-white border-marxi-accent shadow-glow-red font-bold scale-[1.02]" : isProviderFailed(provider.id) ? "bg-marxi-900/80 text-red-400/70 border-red-900/40 hover:bg-marxi-800 hover:text-red-300" : "bg-marxi-800 text-gray-300 border-marxi-700/80 hover:bg-marxi-700 hover:text-white"
        ])}"><span>${ssrInterpolate(provider.label)}</span>`);
        if (isProviderFailed(provider.id)) {
          _push(`<span class="text-[9px] px-1 py-0.2 rounded bg-red-950 text-red-400 font-bold border border-red-800/50 uppercase"> Failed </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
      });
      _push(`<!--]--></div></div><div class="flex items-center space-x-2 pt-2 border-t border-marxi-800/70 overflow-x-auto hide-scrollbar"><span class="text-[11px] font-bold text-gray-400 shrink-0 flex items-center space-x-1"><svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-marxi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg><span>Requested Audio Language:</span></span><div class="flex items-center space-x-1.5 shrink-0"><button class="${ssrRenderClass([
        "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 border min-h-[30px]",
        unref(requestedLang) === void 0 ? "bg-marxi-gold text-black border-marxi-gold font-bold shadow-md" : "bg-marxi-800 text-gray-300 border-marxi-700/80 hover:text-white"
      ])}"> \u{1F310} Default (Auto) </button><button class="${ssrRenderClass([
        "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 border min-h-[30px]",
        unref(requestedLang) === "hi" ? "bg-marxi-accent text-white border-marxi-accent font-bold shadow-glow-red" : "bg-marxi-800 text-gray-300 border-marxi-700/80 hover:text-white"
      ])}"> \u{1F1EE}\u{1F1F3} Hindi (?lang=hi) </button><button class="${ssrRenderClass([
        "px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 border min-h-[30px]",
        unref(requestedLang) === "en" ? "bg-marxi-accent text-white border-marxi-accent font-bold shadow-glow-red" : "bg-marxi-800 text-gray-300 border-marxi-700/80 hover:text-white"
      ])}"> \u{1F1EC}\u{1F1E7} English (?lang=en) </button></div></div></div>`);
      if (unref(currentState) === "FALLBACK") {
        _push(`<div class="bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-amber-900/40 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200 flex items-center justify-between gap-3 animate-fade-in shadow-md"><div class="flex items-center space-x-2.5"><svg class="animate-spin h-4 w-4 text-amber-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span class="font-medium"> Trying another server (${ssrInterpolate(unref(activeProvider).name)})... </span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative w-full aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border-y sm:border border-marxi-800/80 group">`);
      if (unref(currentState) === "LOADING" || unref(currentState) === "FALLBACK") {
        _push(`<div class="absolute top-0 left-0 right-0 h-1 bg-marxi-accent animate-pulse z-30"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(currentState) === "LOADING" || unref(currentState) === "FALLBACK") {
        _push(`<div class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-marxi-950/90 backdrop-blur-sm text-white p-6 space-y-4"><div class="relative flex items-center justify-center"><div class="w-14 h-14 rounded-full border-4 border-marxi-accent/20 border-t-marxi-accent animate-spin"></div><div class="absolute w-8 h-8 rounded-full bg-marxi-accent/10 flex items-center justify-center text-marxi-accent"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current ml-0.5" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg></div></div><div class="text-center space-y-1"><p class="font-display font-bold text-sm sm:text-base text-white tracking-wide">${ssrInterpolate(unref(currentState) === "FALLBACK" ? "Trying another server..." : "Connecting to " + unref(activeProvider).name + "...")}</p><p class="text-xs text-gray-400"> Please wait while we resolve your media stream... </p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(currentState) === "FINAL_ERROR") {
        _push(`<div class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-marxi-950 text-white p-6 text-center space-y-4"><div class="w-16 h-16 rounded-full bg-red-500/10 text-marxi-accent border border-marxi-accent/30 flex items-center justify-center shadow-glow-red"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div><div class="max-w-md space-y-2"><h3 class="font-display font-bold text-lg sm:text-xl text-white"> Playback Unavailable </h3><p class="text-xs sm:text-sm text-gray-400 leading-relaxed"> Sorry, this title is currently unavailable across all streaming servers. Please try again later. </p></div><div class="pt-2 flex items-center space-x-3"><button class="px-5 py-2.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-xs rounded-xl shadow-glow-red transition-all min-h-[44px]"> Retry Stream Connection </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<iframe${ssrRenderAttr("src", unref(currentEmbedUrl))} class="w-full h-full border-0 relative z-10" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture; fullscreen" style="${ssrRenderStyle(unref(currentState) === "PLAYING" || unref(currentState) === "LOADING" || unref(currentState) === "FALLBACK" ? null : { display: "none" })}"></iframe></div></div>`);
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
//# sourceMappingURL=PlaybackPlayer-B-HjWs5W.mjs.map
