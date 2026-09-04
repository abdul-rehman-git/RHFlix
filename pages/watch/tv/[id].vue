<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-8">
    
    <!-- Top Action Bar -->
    <div class="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
      <NuxtLink 
        :to="`/tv/${tvId}`" 
        class="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-marxi-850 hover:bg-marxi-800 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-marxi-800 transition-colors min-h-[40px] sm:min-h-[44px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Series Details</span>
      </NuxtLink>

      <!-- Episode Navigation Controls -->
      <div class="flex items-center space-x-2">
        <button
          v-if="hasPrevEpisode"
          @click="selectEpisode(currentSeasonNumber, currentEpisodeNumber - 1)"
          class="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-marxi-850 hover:bg-marxi-800 text-white font-semibold text-xs rounded-xl border border-marxi-800 flex items-center space-x-1 transition-colors min-h-[40px] sm:min-h-[44px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous Episode</span>
        </button>

        <button
          v-if="hasNextEpisode"
          @click="selectEpisode(currentSeasonNumber, currentEpisodeNumber + 1)"
          class="px-3 py-2 sm:px-3.5 sm:py-2.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-xs rounded-xl shadow-glow-red flex items-center space-x-1 transition-all min-h-[40px] sm:min-h-[44px]"
        >
          <span>Next Episode</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Playback Player Section -->
    <div class="-mx-3 sm:mx-0">
      <PlaybackPlayer 
        mediaType="tv" 
        :tmdbId="tvId" 
        :season="currentSeasonNumber"
        :episode="currentEpisodeNumber"
        :title="show?.name"
        :posterPath="show?.poster_path"
        :backdropPath="show?.backdrop_path"
        :episodeName="activeEpisode?.name"
      />
    </div>

    <!-- TV Show & Episode Info -->
    <div class="bg-marxi-850 rounded-2xl p-4 sm:p-6 border border-marxi-800 space-y-3.5 sm:space-y-6 shadow-xl">
      
      <!-- Title & Current Episode Banner -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-marxi-800 pb-3.5 sm:pb-4">
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

      <!-- Season Episode Cards List -->
      <div v-if="seasonDetails && seasonDetails.episodes" class="space-y-2 pt-3 border-t border-marxi-800">
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

    <!-- Top Cast Section -->
    <div v-if="topCast.length > 0" class="space-y-3 sm:space-y-4 pt-2 sm:pt-4 border-t border-marxi-800">
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
          class="group relative bg-marxi-850 hover:bg-marxi-800 p-2 sm:p-3 rounded-2xl border border-marxi-800 hover:border-marxi-700 transition-all duration-300 flex items-center space-x-2.5"
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
              {{ actor.character }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Similar TV Shows Row -->
    <ContentRow 
      v-if="similarShows.length > 0"
      title="More Series Like This" 
      :items="similarShows" 
      :loading="loadingSimilar"
    />

  </div>
</template>

<script setup lang="ts">
import { useTmdb } from '~/composables/useTmdb';
import type { TVDetails, SeasonDetails, Episode, MediaItem, CastMember } from '~/types/tmdb';

const route = useRoute();
const router = useRouter();

const tvId = computed(() => route.params.id as string);
const currentSeasonNumber = ref(1);
const currentEpisodeNumber = ref(1);

const { getTVDetails, getSeasonDetails, getCredits, getSimilar, getImageUrl } = useTmdb();

const show = ref<TVDetails | null>(null);
const seasonDetails = ref<SeasonDetails | null>(null);
const topCast = ref<CastMember[]>([]);
const similarShows = ref<MediaItem[]>([]);
const loadingSimilar = ref(true);

const validSeasons = computed(() => {
  if (!show.value || !show.value.seasons) return [];
  return show.value.seasons.filter(s => s.season_number > 0);
});

const activeEpisode = computed<Episode | null>(() => {
  if (!seasonDetails.value || !seasonDetails.value.episodes) return null;
  return seasonDetails.value.episodes.find(e => e.episode_number === currentEpisodeNumber.value) || seasonDetails.value.episodes[0] || null;
});

const hasPrevEpisode = computed(() => {
  return currentEpisodeNumber.value > 1;
});

const hasNextEpisode = computed(() => {
  if (!seasonDetails.value || !seasonDetails.value.episodes) return false;
  return currentEpisodeNumber.value < seasonDetails.value.episodes.length;
});

const getInitials = (name: string): string => {
  if (!name) return 'RH';
  const parts = name.split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const loadShowData = async () => {
  if (!tvId.value) return;
  try {
    show.value = await getTVDetails(tvId.value);
    
    // Default to first valid season if seasons exist
    if (validSeasons.value.length > 0) {
      currentSeasonNumber.value = validSeasons.value[0].season_number;
    }

    await loadSeasonData();
    
    // Fetch credits & similar
    const [credRes, simRes] = await Promise.all([
      getCredits('tv', tvId.value),
      getSimilar('tv', tvId.value)
    ]);
    topCast.value = (credRes.cast || []).slice(0, 6);
    similarShows.value = simRes.results || [];
  } catch (err) {
    console.error('Error loading TV details:', err);
  } finally {
    loadingSimilar.value = false;
  }
};

const loadSeasonData = async () => {
  if (!tvId.value) return;
  try {
    seasonDetails.value = await getSeasonDetails(tvId.value, currentSeasonNumber.value);
  } catch (err) {
    console.error('Error loading Season details:', err);
  }
};

const handleSeasonSelect = async () => {
  currentEpisodeNumber.value = 1;
  await loadSeasonData();
};

const selectEpisode = (season: number, episode: number) => {
  currentSeasonNumber.value = season;
  currentEpisodeNumber.value = episode;
};

onMounted(() => {
  loadShowData();
});

watch(() => tvId.value, () => {
  loadShowData();
});

useHead({
  title: computed(() => {
    if (!show.value) return 'Watch TV Series - RHFlix';
    return `Watch ${show.value.name} S${currentSeasonNumber.value} E${currentEpisodeNumber.value} - RHFlix`;
  })
});
</script>
