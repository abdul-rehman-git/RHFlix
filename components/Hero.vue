<template>
  <div v-if="item" class="relative w-full h-[60vh] min-h-[460px] sm:h-[70vh] sm:min-h-[520px] max-h-[750px] overflow-hidden bg-marxi-950">
    <!-- Backdrop Image -->
    <div class="absolute inset-0">
      <img 
        :src="getImageUrl(item.backdrop_path || item.poster_path, 'original')" 
        :alt="item.title || item.name || 'Hero Backdrop'" 
        class="w-full h-full object-cover object-center scale-105 transform animate-fade-in"
      />
      <!-- Dark Vignette & Gradient Overlays -->
      <div class="absolute inset-0 bg-gradient-to-r from-marxi-950 via-marxi-950/85 sm:via-marxi-950/75 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-marxi-900 via-transparent to-marxi-950/60"></div>
    </div>

    <!-- Content Container -->
    <div class="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
      <div class="max-w-2xl space-y-3 sm:space-y-4 pt-12 sm:pt-0">
        
        <!-- Media Type & Rating Badges -->
        <div class="flex items-center space-x-2.5 sm:space-x-3 text-xs font-semibold">
          <span class="px-2.5 py-1 bg-marxi-accent text-white rounded-md tracking-wider uppercase font-bold text-[10px]">
            Featured {{ item.title ? 'Movie' : 'TV Show' }}
          </span>
          
          <div v-if="item.vote_average" class="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-marxi-gold border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span class="text-white font-bold">{{ item.vote_average.toFixed(1) }}</span>
          </div>

          <span v-if="releaseYear" class="text-gray-300 font-medium">
            {{ releaseYear }}
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-2xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-tight sm:leading-none drop-shadow-md line-clamp-2">
          {{ item.title || item.name }}
        </h1>

        <!-- Tagline / Overview -->
        <p class="text-gray-300 text-xs sm:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl drop-shadow">
          {{ item.overview || 'Stream your favorite movies and series in full HD on RHFlix.' }}
        </p>

        <!-- Action Buttons -->
        <div class="pt-2 sm:pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
          <NuxtLink 
            :to="watchUrl"
            class="px-5 py-3 sm:px-6 sm:py-3.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold rounded-xl flex items-center space-x-2 shadow-glow-red hover:scale-105 active:scale-95 transition-all duration-200 min-h-[44px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
            <span>Watch Now</span>
          </NuxtLink>

          <NuxtLink 
            :to="detailsUrl"
            class="px-5 py-3 sm:px-6 sm:py-3.5 bg-marxi-800/80 hover:bg-marxi-700 text-white font-semibold rounded-xl flex items-center space-x-2 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-200 min-h-[44px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>More Info</span>
          </NuxtLink>

          <button 
            @click="toggleMyList(item)"
            class="p-3 sm:p-3.5 bg-marxi-800/80 hover:bg-marxi-700 text-white rounded-xl backdrop-blur-md border border-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            :title="inList ? 'Remove from My List' : 'Add to My List'"
            aria-label="Toggle My List"
          >
            <svg v-if="!inList" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-marxi-accent fill-current" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MediaItem } from '~/types/tmdb';

const props = defineProps<{
  item: MediaItem;
}>();

const { getImageUrl } = useTmdb();
const { isInList, toggleMyList } = useMyList();

const isMovie = computed(() => Boolean(props.item.title || props.item.media_type === 'movie'));
const releaseYear = computed(() => {
  const dateStr = props.item.release_date || props.item.first_air_date;
  return dateStr ? dateStr.substring(0, 4) : '';
});

const watchUrl = computed(() => {
  return isMovie.value 
    ? `/watch/movie/${props.item.id}`
    : `/watch/tv/${props.item.id}/1/1`;
});

const detailsUrl = computed(() => {
  return isMovie.value 
    ? `/movie/${props.item.id}`
    : `/tv/${props.item.id}`;
});

const inList = computed(() => {
  return isInList(props.item.id, isMovie.value ? 'movie' : 'tv');
});
</script>
