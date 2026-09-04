<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6">
    
    <!-- Top Action Bar -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <NuxtLink 
        :to="`/tv/${tvId}`" 
        class="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-marxi-850 hover:bg-marxi-800 px-3.5 py-2.5 rounded-xl border border-marxi-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Series Details</span>
      </NuxtLink>

      <!-- Episode Navigation (Prev / Next) -->
      <div class="flex items-center space-x-2">
        <NuxtLink
          v-if="hasPrevEpisode"
          :to="prevEpisodeUrl"
          class="px-3.5 py-2.5 bg-marxi-850 hover:bg-marxi-800 text-white font-semibold text-xs rounded-xl border border-marxi-800 flex items-center space-x-1.5 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Prev Ep</span>
        </NuxtLink>

        <NuxtLink
          v-if="hasNextEpisode"
          :to="nextEpisodeUrl"
          class="px-3.5 py-2.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-xs rounded-xl shadow-glow-red flex items-center space-x-1.5 transition-all"
        >
          <span>Next Ep</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Playback Player Section -->
    <div class="-mx-3 sm:mx-0">
      <PlaybackPlayer 
        mediaType="tv" 
        :tmdbId="tvId" 
        :season="seasonNumber"
        :episode="episodeNumber"
        :title="show?.name"
        :posterPath="show?.poster_path"
        :backdropPath="currentEpisode?.still_path || show?.backdrop_path"
        :episodeName="currentEpisode?.name"
      />
    </div>

    <!-- TV Show & Episode Info -->
    <div class="bg-marxi-850 rounded-2xl p-4 sm:p-6 border border-marxi-800 space-y-4 shadow-xl">
      
      <!-- Title & Current Episode Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-marxi-800 pb-4">
        <div>
          <div class="flex items-center space-x-2 text-xs font-bold text-marxi-accent mb-1">
            <span>{{ show?.name || 'TV Series' }}</span>
            <span>•</span>
            <span>Season {{ seasonNumber }}, Episode {{ episodeNumber }}</span>
          </div>
          <h1 class="text-xl sm:text-3xl font-display font-black text-white">
            {{ currentEpisode?.name || `Episode ${episodeNumber}` }}
          </h1>
        </div>

        <!-- Quick Season Dropdown -->
        <div class="flex items-center space-x-2">
          <select 
            v-model="selectedSeason"
            @change="handleSeasonChange"
            class="bg-marxi-800 border border-marxi-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-marxi-accent"
          >
            <option 
              v-for="s in show?.seasons?.filter(s => s.season_number > 0)" 
              :key="s.id" 
              :value="s.season_number"
            >
              Season {{ s.season_number }} ({{ s.episode_count }} Ep)
            </option>
          </select>
        </div>
      </div>

      <!-- Episode Overview -->
      <div class="space-y-1">
        <h3 class="text-white font-bold text-xs sm:text-sm">Episode Overview</h3>
        <p class="text-gray-300 text-xs sm:text-sm leading-relaxed">
          {{ currentEpisode?.overview || show?.overview || 'No episode description available.' }}
        </p>
      </div>

      <!-- Season Episode Chips Navigation -->
      <div v-if="seasonDetails && seasonDetails.episodes" class="space-y-2 pt-3 border-t border-marxi-800">
        <h4 class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
          Season {{ seasonNumber }} Episodes
        </h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          <NuxtLink
            v-for="ep in seasonDetails.episodes"
            :key="ep.id"
            :to="`/watch/tv/${tvId}/${seasonNumber}/${ep.episode_number}`"
            class="px-3 py-2 rounded-xl text-center text-xs font-semibold transition-all border"
            :class="[
              ep.episode_number === episodeNumber
                ? 'bg-marxi-accent text-white border-marxi-accent shadow-glow-red font-bold'
                : 'bg-marxi-800 text-gray-300 border-marxi-700 hover:bg-marxi-700 hover:text-white'
            ]"
          >
            Ep {{ ep.episode_number }}
          </NuxtLink>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { useTmdb } from '~/composables/useTmdb';
import { useWatchHistory } from '~/composables/useWatchHistory';
import type { TVDetails, SeasonDetails, Episode } from '~/types/tmdb';

definePageMeta({
  key: route => route.fullPath
});

const route = useRoute();
const router = useRouter();

const tvId = computed(() => route.params.id as string);
const seasonNumber = computed(() => Number(route.params.season) || 1);
const episodeNumber = computed(() => Number(route.params.episode) || 1);

const { getTVDetails, getSeasonDetails, getImageUrl } = useTmdb();
const { addWatchHistory } = useWatchHistory();

const show = ref<TVDetails | null>(null);
const seasonDetails = ref<SeasonDetails | null>(null);
const selectedSeason = ref(seasonNumber.value);

const currentEpisode = computed<Episode | undefined>(() => {
  return seasonDetails.value?.episodes.find(e => e.episode_number === episodeNumber.value);
});

const totalEpisodesInSeason = computed(() => seasonDetails.value?.episodes.length || 0);

const hasPrevEpisode = computed(() => {
  return episodeNumber.value > 1 || seasonNumber.value > 1;
});

const hasNextEpisode = computed(() => {
  if (episodeNumber.value < totalEpisodesInSeason.value) return true;
  if (show.value?.number_of_seasons && seasonNumber.value < show.value.number_of_seasons) return true;
  return false;
});

const prevEpisodeUrl = computed(() => {
  if (episodeNumber.value > 1) {
    return `/watch/tv/${tvId.value}/${seasonNumber.value}/${episodeNumber.value - 1}`;
  } else if (seasonNumber.value > 1) {
    return `/watch/tv/${tvId.value}/${seasonNumber.value - 1}/1`;
  }
  return `/tv/${tvId.value}`;
});

const nextEpisodeUrl = computed(() => {
  if (episodeNumber.value < totalEpisodesInSeason.value) {
    return `/watch/tv/${tvId.value}/${seasonNumber.value}/${episodeNumber.value + 1}`;
  } else if (show.value?.number_of_seasons && seasonNumber.value < show.value.number_of_seasons) {
    return `/watch/tv/${tvId.value}/${seasonNumber.value + 1}/1`;
  }
  return `/tv/${tvId.value}`;
});

const handleSeasonChange = () => {
  router.push(`/watch/tv/${tvId.value}/${selectedSeason.value}/1`);
};

const loadShowAndSeasonData = async () => {
  try {
    show.value = await getTVDetails(tvId.value);
    seasonDetails.value = await getSeasonDetails(tvId.value, seasonNumber.value);
    selectedSeason.value = seasonNumber.value;

    const epName = currentEpisode.value?.name || `Episode ${episodeNumber.value}`;

    if (show.value) {
      useSeoMeta({
        title: `Watching ${show.value.name} S${seasonNumber.value} E${episodeNumber.value} (${epName}) - RHFlix`,
        ogTitle: `Watching ${show.value.name} S${seasonNumber.value} E${episodeNumber.value} - RHFlix`,
        description: currentEpisode.value?.overview || show.value.overview,
        ogDescription: currentEpisode.value?.overview || show.value.overview
      });

      addWatchHistory({
        tmdbId: show.value.id,
        type: 'tv',
        title: show.value.name,
        posterPath: show.value.poster_path,
        backdropPath: currentEpisode.value?.still_path || show.value.backdrop_path,
        season: seasonNumber.value,
        episode: episodeNumber.value,
        episodeName: epName
      });
    }
  } catch (err) {
    console.error('Error fetching watch TV data:', err);
  }
};

watch(() => [tvId.value, seasonNumber.value, episodeNumber.value], () => {
  loadShowAndSeasonData();
});

onMounted(() => {
  loadShowAndSeasonData();
});
</script>
