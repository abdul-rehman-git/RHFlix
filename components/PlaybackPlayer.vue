<template>
  <div class="w-full">
    <!-- Player Aspect-Video Container -->
    <div class="relative w-full aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border-y sm:border border-marxi-800/80 group">
      
      <!-- Minimal Top Loading Line -->
      <div 
        v-if="loading" 
        class="absolute top-0 left-0 right-0 h-1 bg-marxi-accent animate-pulse z-20"
      ></div>

      <!-- Fallback Error State -->
      <div 
        v-if="hasError" 
        class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-marxi-950 text-white p-6 text-center space-y-4"
      >
        <div class="w-14 h-14 rounded-full bg-red-500/10 text-marxi-accent border border-marxi-accent/30 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="max-w-md space-y-2">
          <h3 class="font-display font-bold text-xl text-white">Playback Interrupted</h3>
          <p class="text-sm text-gray-400">
            Having trouble loading this stream? Try switching to alternative server source.
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="toggleProvider"
            class="px-6 py-3 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-sm rounded-xl shadow-glow-red transition-all"
          >
            Switch to {{ selectedProviderId === 'embed-api-stream' ? 'VidPhantom' : 'Embed API Stream' }}
          </button>
          <button 
            @click="retryLoad"
            class="px-5 py-3 bg-marxi-800 hover:bg-marxi-700 text-white font-semibold text-sm rounded-xl border border-white/10 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Provider Iframe -->
      <iframe
        v-if="currentEmbedUrl"
        :src="currentEmbedUrl"
        class="w-full h-full border-0"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        @load="handleIframeLoad"
        @error="handleIframeError"
      ></iframe>

    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  getMoviePlaybackUrl, 
  getEpisodePlaybackUrl, 
  type PlaybackProviderId 
} from '~/services/playback';

const props = withDefaults(defineProps<{
  mediaType: 'movie' | 'tv';
  tmdbId: number | string;
  season?: number | string;
  episode?: number | string;
  title?: string;
}>(), {
  season: 1,
  episode: 1
});

const selectedProviderId = ref<PlaybackProviderId>('embed-api-stream');
const loading = ref(true);
const hasError = ref(false);

const currentEmbedUrl = computed(() => {
  if (!props.tmdbId) return '';
  if (props.mediaType === 'movie') {
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

const toggleProvider = () => {
  selectedProviderId.value = selectedProviderId.value === 'embed-api-stream' ? 'vidphantom' : 'embed-api-stream';
  loading.value = true;
  hasError.value = false;
};

const handleIframeLoad = () => {
  loading.value = false;
};

const handleIframeError = () => {
  loading.value = false;
  hasError.value = true;
};

const retryLoad = () => {
  hasError.value = false;
  loading.value = true;
};

watch(
  () => [props.tmdbId, props.season, props.episode, props.mediaType], 
  () => {
    loading.value = true;
    hasError.value = false;
  }
);
</script>
