<template>
  <div class="w-full space-y-3">
    <!-- Server Selector & Audio Language Control Bar -->
    <div class="flex flex-col gap-2.5 bg-marxi-850 p-2.5 sm:p-3 rounded-2xl border border-marxi-800 shadow-lg">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div class="flex items-center space-x-2 shrink-0">
          <span 
            :class="[
              'w-2.5 h-2.5 rounded-full transition-all duration-300',
              currentState === 'PLAYING' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' :
              currentState === 'LOADING' || currentState === 'FALLBACK' ? 'bg-amber-500 animate-spin' :
              currentState === 'FINAL_ERROR' ? 'bg-red-500' : 'bg-gray-500'
            ]"
          ></span>
          <span class="text-xs font-bold text-gray-200 tracking-wide">
            Streaming Server:
          </span>
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-md bg-marxi-800 text-marxi-gold border border-marxi-gold/20">
            {{ mode === 'auto' ? 'Auto (' + activeProvider.name + ')' : activeProvider.name }}
            <template v-if="isUsingMirror"> (Mirror)</template>
          </span>
        </div>

        <!-- Server Switcher Pill Buttons -->
        <div class="flex items-center space-x-1.5 overflow-x-auto hide-scrollbar pb-0.5 sm:pb-0">
          <button
            @click="selectAutoMode"
            :class="[
              'px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1 shrink-0 border min-h-[36px]',
              mode === 'auto'
                ? 'bg-marxi-gold text-black border-marxi-gold font-bold scale-[1.02] shadow-md'
                : 'bg-marxi-800 text-gray-300 border-marxi-700/80 hover:bg-marxi-700 hover:text-white'
            ]"
          >
            <span>⚡ Auto</span>
          </button>

          <button 
            v-for="provider in PLAYBACK_PROVIDERS" 
            :key="provider.id"
            @click="handleManualProviderSelect(provider.id)"
            :class="[
              'px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center space-x-1.5 shrink-0 border min-h-[36px]',
              mode === 'manual' && selectedProviderId === provider.id 
                ? 'bg-marxi-accent text-white border-marxi-accent shadow-glow-red font-bold scale-[1.02]' 
                : isProviderFailed(provider.id)
                  ? 'bg-marxi-900/80 text-red-400/70 border-red-900/40 hover:bg-marxi-800 hover:text-red-300'
                  : 'bg-marxi-800 text-gray-300 border-marxi-700/80 hover:bg-marxi-700 hover:text-white'
            ]"
          >
            <span>{{ provider.label }}</span>
            <span 
              v-if="isProviderFailed(provider.id)" 
              class="text-[9px] px-1 py-0.2 rounded bg-red-950 text-red-400 font-bold border border-red-800/50 uppercase"
            >
              Failed
            </span>
          </button>
        </div>
      </div>

      <!-- VidCore Language Query Switcher (?lang=hi / ?lang=en) -->
      <div class="flex items-center space-x-2 pt-2 border-t border-marxi-800/70 overflow-x-auto hide-scrollbar">
        <span class="text-[11px] font-bold text-gray-400 shrink-0 flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-marxi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span>Requested Audio Language:</span>
        </span>
        <div class="flex items-center space-x-1.5 shrink-0">
          <button 
            @click="setAudioLanguage(undefined)"
            :class="[
              'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 border min-h-[30px]',
              requestedLang === undefined 
                ? 'bg-marxi-gold text-black border-marxi-gold font-bold shadow-md' 
                : 'bg-marxi-800 text-gray-300 border-marxi-700/80 hover:text-white'
            ]"
          >
            🌐 Default (Auto)
          </button>
          <button 
            @click="setAudioLanguage('hi')"
            :class="[
              'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 border min-h-[30px]',
              requestedLang === 'hi' 
                ? 'bg-marxi-accent text-white border-marxi-accent font-bold shadow-glow-red' 
                : 'bg-marxi-800 text-gray-300 border-marxi-700/80 hover:text-white'
            ]"
          >
            🇮🇳 Hindi (?lang=hi)
          </button>
          <button 
            @click="setAudioLanguage('en')"
            :class="[
              'px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 border min-h-[30px]',
              requestedLang === 'en' 
                ? 'bg-marxi-accent text-white border-marxi-accent font-bold shadow-glow-red' 
                : 'bg-marxi-800 text-gray-300 border-marxi-700/80 hover:text-white'
            ]"
          >
            🇬🇧 English (?lang=en)
          </button>
        </div>
      </div>
    </div>

    <!-- Automatic Fallback Status Toast -->
    <div 
      v-if="currentState === 'FALLBACK'" 
      class="bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-amber-900/40 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200 flex items-center justify-between gap-3 animate-fade-in shadow-md"
    >
      <div class="flex items-center space-x-2.5">
        <svg class="animate-spin h-4 w-4 text-amber-400 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="font-medium">
          Trying another server ({{ activeProvider.name }})...
        </span>
      </div>
    </div>

    <!-- Main Player 16:9 Aspect Ratio Container -->
    <div class="relative w-full aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border-y sm:border border-marxi-800/80 group">
      
      <!-- Top Animated Progress Indicator -->
      <div 
        v-if="currentState === 'LOADING' || currentState === 'FALLBACK'" 
        class="absolute top-0 left-0 right-0 h-1 bg-marxi-accent animate-pulse z-30"
      ></div>

      <!-- Loading / Fallback Skeleton Overlay -->
      <div 
        v-if="currentState === 'LOADING' || currentState === 'FALLBACK'" 
        class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-marxi-950/90 backdrop-blur-sm text-white p-6 space-y-4"
      >
        <div class="relative flex items-center justify-center">
          <div class="w-14 h-14 rounded-full border-4 border-marxi-accent/20 border-t-marxi-accent animate-spin"></div>
          <div class="absolute w-8 h-8 rounded-full bg-marxi-accent/10 flex items-center justify-center text-marxi-accent">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current ml-0.5" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="text-center space-y-1">
          <p class="font-display font-bold text-sm sm:text-base text-white tracking-wide">
            {{ currentState === 'FALLBACK' ? 'Trying another server...' : 'Connecting to ' + activeProvider.name + '...' }}
          </p>
          <p class="text-xs text-gray-400">
            Please wait while we resolve your media stream...
          </p>
        </div>
      </div>

      <!-- FINAL ERROR STATE (Shown only after all providers fail) -->
      <div 
        v-if="currentState === 'FINAL_ERROR'" 
        class="absolute inset-0 z-40 flex flex-col items-center justify-center bg-marxi-950 text-white p-6 text-center space-y-4"
      >
        <div class="w-16 h-16 rounded-full bg-red-500/10 text-marxi-accent border border-marxi-accent/30 flex items-center justify-center shadow-glow-red">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="max-w-md space-y-2">
          <h3 class="font-display font-bold text-lg sm:text-xl text-white">
            Playback Unavailable
          </h3>
          <p class="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Sorry, this title is currently unavailable across all streaming servers. Please try again later.
          </p>
        </div>
        <div class="pt-2 flex items-center space-x-3">
          <button 
            @click="resetSessionAndRetry" 
            class="px-5 py-2.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-xs rounded-xl shadow-glow-red transition-all min-h-[44px]"
          >
            Retry Stream Connection
          </button>
        </div>
      </div>

      <!-- Live Stream Iframe Player (VidCore / Providers) -->
      <iframe
        v-show="currentState === 'PLAYING' || currentState === 'LOADING' || currentState === 'FALLBACK'"
        ref="iframeRef"
        :src="currentEmbedUrl"
        class="w-full h-full border-0 relative z-10"
        allowfullscreen
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        @load="handleIframeLoad"
      ></iframe>

    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PLAYBACK_PROVIDERS, 
  getProviderById, 
  getNextProvider, 
  buildMoviePlaybackUrl, 
  buildEpisodePlaybackUrl 
} from '~/services/playback';
import type { PlaybackProviderId, PlaybackState, PlaybackMode } from '~/types/playback';
import { useWatchHistory } from '~/composables/useWatchHistory';

const props = defineProps<{
  mediaType: 'movie' | 'tv';
  tmdbId: number | string;
  season?: number;
  episode?: number;
  title?: string;
  posterPath?: string;
  backdropPath?: string;
  episodeName?: string;
  defaultLang?: string;
}>();

const route = useRoute();
const { addWatchHistory } = useWatchHistory();

const mode = ref<PlaybackMode>('auto');
const selectedProviderId = ref<PlaybackProviderId>('vidcore');
const userSelectedLang = ref<string | undefined>(undefined);
const isUsingMirror = ref<boolean>(false);

const failedProviders = ref<Set<PlaybackProviderId>>(new Set());
const currentState = ref<PlaybackState>('LOADING');

const iframeRef = ref<HTMLIFrameElement | null>(null);
let fallbackGraceTimer: ReturnType<typeof setTimeout> | null = null;

const activeProvider = computed(() => getProviderById(selectedProviderId.value));

/**
 * Computes active language parameter from user selection, prop, or route query string (?lang=hi).
 */
const requestedLang = computed(() => {
  return userSelectedLang.value !== undefined 
    ? userSelectedLang.value 
    : (props.defaultLang || (route.query.lang as string) || undefined);
});

/**
 * Dynamically computes the VidCore or fallback provider embed URL.
 * Preserves mediaType, tmdbId, season, episode, and passes defaultLang if specified.
 */
const currentEmbedUrl = computed(() => {
  if (!props.tmdbId) return '';
  const lang = requestedLang.value;
  if (props.mediaType === 'movie') {
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

const isProviderFailed = (id: PlaybackProviderId) => {
  return failedProviders.value.has(id);
};

const setAudioLanguage = (langCode: string | undefined) => {
  userSelectedLang.value = langCode;
  isUsingMirror.value = false;
  selectedProviderId.value = 'vidcore';
  currentState.value = 'LOADING';
  startGraceTimer();
};

// Grace timer for validating frame load
const startGraceTimer = () => {
  if (fallbackGraceTimer) clearTimeout(fallbackGraceTimer);
  
  // 7s Grace Timer: If provider fails to respond or stay stuck in LOADING/FALLBACK
  fallbackGraceTimer = setTimeout(() => {
    if (currentState.value === 'LOADING' || currentState.value === 'FALLBACK') {
      if (!isUsingMirror.value) {
        isUsingMirror.value = true;
        startGraceTimer();
      } else {
        triggerFatalProviderFailure(selectedProviderId.value, 'Load Timeout');
      }
    }
  }, 7000);
};

const clearGraceTimer = () => {
  if (fallbackGraceTimer) {
    clearTimeout(fallbackGraceTimer);
    fallbackGraceTimer = null;
  }
};

// Trigger Auto Failover Chain (VidCore -> VidPhantom -> NexStream -> VidSrc Hair)
const triggerFatalProviderFailure = (failedId: PlaybackProviderId, reason: string) => {
  clearGraceTimer();

  failedProviders.value.add(failedId);
  isUsingMirror.value = false;

  const next = getNextProvider(failedId, failedProviders.value);

  if (next && mode.value === 'auto') {
    currentState.value = 'FALLBACK';
    selectedProviderId.value = next.id;
    startGraceTimer();
  } else {
    currentState.value = 'FINAL_ERROR';
  }
};

const selectAutoMode = () => {
  clearGraceTimer();
  mode.value = 'auto';
  isUsingMirror.value = false;
  
  const next = getNextProvider('vidcore', failedProviders.value) || PLAYBACK_PROVIDERS[0];
  selectedProviderId.value = next.id;
  currentState.value = 'LOADING';
  startGraceTimer();
};

const handleManualProviderSelect = (id: PlaybackProviderId) => {
  clearGraceTimer();
  mode.value = 'manual';
  
  if (failedProviders.value.has(id)) {
    failedProviders.value.delete(id);
  }

  isUsingMirror.value = false;
  selectedProviderId.value = id;
  currentState.value = 'LOADING';
  startGraceTimer();
};

const resetSessionAndRetry = () => {
  clearGraceTimer();
  failedProviders.value.clear();
  isUsingMirror.value = false;
  mode.value = 'auto';
  selectedProviderId.value = 'vidcore';
  currentState.value = 'LOADING';
  startGraceTimer();
};

const handleIframeLoad = () => {
  clearGraceTimer();
  currentState.value = 'PLAYING';

  if (props.tmdbId && props.title) {
    addWatchHistory({
      tmdbId: props.tmdbId,
      type: props.mediaType,
      title: props.title,
      posterPath: props.posterPath || null,
      backdropPath: props.backdropPath || null,
      season: props.season,
      episode: props.episode,
      episodeName: props.episodeName
    });
  }
};

onMounted(() => {
  startGraceTimer();
});

onUnmounted(() => {
  clearGraceTimer();
});

watch(
  () => [props.tmdbId, props.season, props.episode, props.mediaType],
  () => {
    failedProviders.value.clear();
    isUsingMirror.value = false;
    currentState.value = 'LOADING';
    startGraceTimer();
  }
);
</script>
