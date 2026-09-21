<template>
  <div class="space-y-3 sm:space-y-4">
    <div 
      v-for="episode in episodes" 
      :key="episode.id || episode.episode_number"
      class="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-4 bg-marxi-850 hover:bg-marxi-800 rounded-2xl border border-marxi-800 hover:border-marxi-700 transition-all duration-200 gap-3 sm:gap-4"
    >
      <!-- Left: Thumbnail & Info -->
      <div class="flex items-start space-x-3 sm:space-x-4 w-full sm:w-auto flex-1 min-w-0">
        <!-- Episode Number Badge -->
        <div class="font-display font-black text-sm sm:text-lg text-gray-400 group-hover:text-marxi-accent w-5 sm:w-6 text-center shrink-0 mt-1 sm:mt-0">
          {{ episode.episode_number }}
        </div>

        <!-- Episode Still Image -->
        <div class="relative aspect-video w-24 sm:w-40 rounded-xl overflow-hidden bg-marxi-800 shrink-0 border border-marxi-700">
          <img 
            :src="getImageUrl(episode.still_path || backdropPath, 'w342')" 
            :alt="episode.name || `Episode ${episode.episode_number}`" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <!-- Released: Play Icon -->
            <div v-if="!isEpisodeUnreleased(episode)" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-marxi-accent text-white flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current ml-0.5" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
            </div>
            <!-- Unreleased: Coming Soon Badge -->
            <div v-else class="px-2 py-1 rounded bg-amber-500 text-black font-extrabold text-[9px] uppercase tracking-wider shadow-md">
              Coming Soon
            </div>
          </div>
        </div>

        <!-- Episode Details -->
        <div class="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
          <div class="flex items-center space-x-2">
            <h4 class="font-bold text-xs sm:text-base text-white truncate group-hover:text-marxi-accent transition-colors">
              {{ episode.name || `Episode ${episode.episode_number}` }}
            </h4>
            <span v-if="isEpisodeUnreleased(episode)" class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Coming Soon
            </span>
          </div>
          <p v-if="episode.air_date" class="text-[11px] sm:text-xs font-medium" :class="isEpisodeUnreleased(episode) ? 'text-amber-400 font-semibold' : 'text-gray-400'">
            {{ isEpisodeUnreleased(episode) ? `Airs: ${formatReleaseDate(episode)}` : `Air Date: ${episode.air_date}` }}
          </p>
          <p v-if="episode.overview" class="text-[11px] sm:text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {{ episode.overview }}
          </p>
        </div>
      </div>

      <!-- Right: Watch Action Button (Min 44px Touch Target) -->
      <NuxtLink 
        v-if="!isEpisodeUnreleased(episode)"
        :to="`/watch/tv/${tvId}/${seasonNumber}/${episode.episode_number}`"
        class="w-full sm:w-auto px-4 py-2.5 bg-marxi-800 group-hover:bg-marxi-accent text-gray-200 group-hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors border border-white/10 shrink-0 min-h-[44px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
        <span>Play Ep {{ episode.episode_number }}</span>
      </NuxtLink>

      <!-- Unreleased Episode Notice Button -->
      <div 
        v-else
        class="w-full sm:w-auto px-4 py-2.5 bg-marxi-900/80 text-amber-400 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 border border-amber-500/30 shrink-0 min-h-[44px] cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
        </svg>
        <span>Coming Soon</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Episode } from '~/types/tmdb';

const props = defineProps<{
  tvId: number | string;
  seasonNumber: number;
  episodes: Episode[];
  backdropPath?: string | null;
}>();

const { getImageUrl } = useTmdb();
const { isComingSoon, formatReleaseDate } = useMediaRelease();

const isEpisodeUnreleased = (episode: Episode): boolean => {
  return isComingSoon(episode);
};
</script>
