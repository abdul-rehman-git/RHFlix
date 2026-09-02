<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-8">
    
    <!-- Top Action Bar -->
    <div class="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
      <NuxtLink 
        :to="`/tv/${tvId}`" 
        class="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-marxi-850/90 hover:bg-marxi-800 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-marxi-700/80 transition-colors min-h-[40px] sm:min-h-[44px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Series</span>
      </NuxtLink>

      <!-- Episode Navigation Controls -->
      <div class="flex items-center space-x-2">
        <button
          v-if="hasPrevEpisode"
          @click="selectEpisode(currentSeasonNumber, currentEpisodeNumber - 1)"
          class="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-marxi-850 hover:bg-marxi-800 text-white font-semibold text-xs rounded-xl border border-marxi-700/80 flex items-center space-x-1 transition-colors min-h-[40px] sm:min-h-[44px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Prev</span>
        </button>

        <button
          v-if="hasNextEpisode"
          @click="selectEpisode(currentSeasonNumber, currentEpisodeNumber + 1)"
          class="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-xs rounded-xl shadow-glow-red flex items-center space-x-1 transition-all min-h-[40px] sm:min-h-[44px]"
        >
          <span>Next Ep</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Playback Player Section (Flush Edge-to-Edge on Mobile) -->
    <div class="-mx-3 sm:mx-0">
      <PlaybackPlayer 
        mediaType="tv" 
        :tmdbId="tvId" 
        :season="currentSeasonNumber"
        :episode="currentEpisodeNumber"
        :title="show?.name"
      />
    </div>

    <!-- TV Show & Episode Info -->
    <div class="bg-marxi-850 rounded-2xl p-4 sm:p-6 border border-marxi-800/80 space-y-3.5 sm:space-y-6 shadow-xl">
      
      <!-- Title & Current Episode Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-marxi-800/80 pb-3.5 sm:pb-4">
        <div>
          <div class="flex items-center space-x-2 text-[11px] sm:text-xs font-bold text-marxi-accent mb-1">
            <span>{{ show?.name || 'TV Series' }}</span>
            <span>•</span>
            <span>S{{ currentSeasonNumber }} E{{ currentEpisodeNumber }}</span>
          </div>
          <h1 class="text-lg sm:text-3xl font-display font-black text-white tracking-tight">
            {{ activeEpisode?.name || `Episode ${currentEpisodeNumber}` }}
          </h1>
        </div>

        <!-- Quick Season Dropdown -->
        <div class="flex items-center space-x-2">
          <select 
            v-model="currentSeasonNumber"
            @change="handleSeasonSelect"
            class="bg-marxi-800 border border-marxi-700 text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-marxi-accent min-h-[40px] sm:min-h-[44px]"
          >
            <option 
              v-for="s in validSeasons" 
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
        <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
          {{ activeEpisode?.overview || show?.overview || 'No episode description available.' }}
        </p>
      </div>

      <!-- Season Episode Cards List (Horizontal Snap Scroll on Mobile) -->
      <div v-if="seasonDetails && seasonDetails.episodes" class="space-y-2 pt-3 border-t border-marxi-800/80">
        <h4 class="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">
          Season {{ currentSeasonNumber }} Episodes
        </h4>
        <div class="flex items-center space-x-2 overflow-x-auto hide-scrollbar sm:grid sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 sm:gap-2 pb-1 sm:pb-0">
          <button
            v-for="ep in seasonDetails.episodes"
            :key="ep.id"
            @click="selectEpisode(currentSeasonNumber, ep.episode_number)"
            class="px-3.5 py-2 sm:px-2.5 sm:py-2.5 rounded-xl text-center text-xs font-semibold transition-all border whitespace-nowrap min-h-[40px] sm:min-h-[44px] flex items-center justify-center shrink-0"
            :class="[
              ep.episode_number === currentEpisodeNumber
                ? 'bg-marxi-accent text-white border-marxi-accent shadow-glow-red font-bold'
                : 'bg-marxi-800 text-gray-300 border-marxi-700 hover:bg-marxi-700 hover:text-white'
            ]"
          >
            Ep {{ ep.episode_number }}
          </button>
        </div>
      </div>

    </div>

    <!-- Top Cast Section (Grid UI) -->
    <div v-if="topCast.length > 0" class="space-y-3 sm:space-y-4 pt-2 sm:pt-4 border-t border-marxi-800/80">
      <div class="flex items-center space-x-2.5">
        <div class="w-1.5 h-5 sm:h-6 bg-marxi-accent rounded-full"></div>
        <h3 class="font-display text-base sm:text-xl font-bold text-white tracking-tight">
          Top Cast & Starring
        </h3>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <div 
          v-for="actor in topCast" 
          :key="actor.id"
          class="group relative bg-marxi-850 hover:bg-marxi-800 p-2 sm:p-3 rounded-2xl border border-marxi-800/80 hover:border-marxi-700 transition-all duration-300 flex items-center space-x-2.5"
        >
          <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-marxi-800 shrink-0 border border-marxi-700 shadow-md group-hover:scale-105 transition-transform">
            <img 
              v-if="actor.profile_path"
              :src="getImageUrl(actor.profile_path, 'w185')" 
              :alt="actor.name"
              class="w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div v-else class="w-full h-full bg-gradient-to-tr from-marxi-800 to-marxi-700 flex items-center justify-center font-bold text-[10px] text-marxi-accent tracking-wider">
              {{ getInitials(actor.name) }}
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold text-white group-hover:text-marxi-accent truncate transition-colors">
              {{ actor.name }}
            </h4>
            <p class="text-[10px] sm:text-[11px] text-gray-400 truncate mt-0.5 font-medium">
              {{ actor.character || 'Cast' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Similar TV Shows Row (Grid Layout) -->
    <ContentRow 
      v-if="similarShows.length > 0"
      title="More TV Series Like This"
      :items="similarShows"
      layout="grid"
    />

  </div>
</template>

<script setup lang="ts">
import type { TVDetails, SeasonDetails, Episode, CastMember, MediaItem } from '~/types/tmdb';

definePageMeta({
  key: route => route.fullPath
});

const route = useRoute();
const router = useRouter();

const tvId = computed(() => route.params.id as string);
const seasonParam = computed(() => Number(route.params.season) || 1);
const episodeParam = computed(() => Number(route.params.episode) || 1);

const currentSeasonNumber = ref(seasonParam.value);
const currentEpisodeNumber = ref(episodeParam.value);

const { getTVDetails, getSeasonDetails, getCredits, getSimilar, getImageUrl } = useTmdb();
const { addWatchHistory } = useWatchHistory();

const show = ref<TVDetails | null>(null);
const seasonDetails = ref<SeasonDetails | null>(null);
const topCast = ref<CastMember[]>([]);
const similarShows = ref<MediaItem[]>([]);

const validSeasons = computed(() => {
  return show.value?.seasons?.filter(s => s.season_number > 0) || [];
});

const activeEpisode = computed<Episode | undefined>(() => {
  return seasonDetails.value?.episodes.find(e => e.episode_number === currentEpisodeNumber.value);
});

const totalEpisodes = computed(() => seasonDetails.value?.episodes.length || 0);

const hasPrevEpisode = computed(() => currentEpisodeNumber.value > 1);
const hasNextEpisode = computed(() => currentEpisodeNumber.value < totalEpisodes.value);

const getInitials = (name: string) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const selectEpisode = (s: number, e: number) => {
  currentSeasonNumber.value = s;
  currentEpisodeNumber.value = e;
  router.push(`/watch/tv/${tvId.value}/${s}/${e}`);
  fetchSeasonData(s);
  recordHistory();
};

const handleSeasonSelect = () => {
  currentEpisodeNumber.value = 1;
  router.push(`/watch/tv/${tvId.value}/${currentSeasonNumber.value}/1`);
  fetchSeasonData(currentSeasonNumber.value);
  recordHistory();
};

const fetchSeasonData = async (seasonNum: number) => {
  try {
    seasonDetails.value = await getSeasonDetails(tvId.value, seasonNum);
  } catch (err) {
    console.error(`Error loading season ${seasonNum}:`, err);
  }
};

const recordHistory = () => {
  if (show.value) {
    const epName = activeEpisode.value?.name || `Episode ${currentEpisodeNumber.value}`;
    addWatchHistory({
      tmdbId: show.value.id,
      type: 'tv',
      title: show.value.name,
      posterPath: show.value.poster_path,
      backdropPath: activeEpisode.value?.still_path || show.value.backdrop_path,
      season: currentSeasonNumber.value,
      episode: currentEpisodeNumber.value,
      episodeName: epName
    });
  }
};

const loadWatchData = async () => {
  try {
    const [showData, creditsData, similarData] = await Promise.all([
      getTVDetails(tvId.value),
      getCredits('tv', tvId.value).catch(() => ({ cast: [], crew: [] })),
      getSimilar('tv', tvId.value).catch(() => ({ results: [] }))
    ]);

    show.value = showData;
    if (show.value) {
      if (route.params.season) {
        currentSeasonNumber.value = Number(route.params.season);
      } else if (validSeasons.value.length > 0) {
        currentSeasonNumber.value = validSeasons.value[0].season_number;
      }

      if (route.params.episode) {
        currentEpisodeNumber.value = Number(route.params.episode);
      }

      useSeoMeta({
        title: `Watching ${show.value.name} S${currentSeasonNumber.value} E${currentEpisodeNumber.value} - RHFlix`,
        ogTitle: `Watching ${show.value.name} S${currentSeasonNumber.value} E${currentEpisodeNumber.value} - RHFlix`,
        description: show.value.overview,
        ogDescription: show.value.overview,
        ogImage: show.value.backdrop_path ? getImageUrl(show.value.backdrop_path, 'w500') : undefined
      });

      useHead({
        link: [
          { rel: 'canonical', href: `https://reflix.rehmanwebs.com/watch/tv/${show.value.id}` }
        ]
      });

      await fetchSeasonData(currentSeasonNumber.value);
      recordHistory();
    }

    if (creditsData) {
      topCast.value = (creditsData.cast || []).slice(0, 12);
    }

    if (similarData && similarData.results) {
      similarShows.value = similarData.results.map(item => ({
        ...item,
        media_type: 'tv'
      }));
    }
  } catch (err) {
    console.error('Error fetching TV show watch data:', err);
  }
};

watch(() => [route.params.id, route.params.season, route.params.episode], () => {
  if (route.params.season) currentSeasonNumber.value = Number(route.params.season);
  if (route.params.episode) currentEpisodeNumber.value = Number(route.params.episode);
  loadWatchData();
});

onMounted(() => {
  loadWatchData();
});
</script>
