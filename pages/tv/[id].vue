<template>
  <div>
    <LoadingSkeleton v-if="loading" type="detail" />
    <ErrorState v-else-if="error" title="TV Show Details Unavailable" :message="error" :retry="loadData" />

    <div v-else-if="show" class="relative">
      
      <!-- Backdrop Banner -->
      <div class="relative w-full h-[45vh] sm:h-[55vh] min-h-[350px] overflow-hidden bg-marxi-950">
        <img 
          :src="getImageUrl(show.backdrop_path || show.poster_path, 'original')" 
          :alt="show.name" 
          class="w-full h-full object-cover object-center scale-105 filter blur-xs"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-marxi-900 via-marxi-950/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-marxi-900 via-marxi-900/80 to-transparent"></div>
      </div>

      <!-- Main Info Container -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-64 z-10 pb-16 space-y-10 sm:space-y-12">
        
        <!-- Show Overview Row -->
        <div class="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
          
          <!-- Left: TV Poster -->
          <div class="w-40 sm:w-64 lg:w-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-marxi-700/60 bg-marxi-850 shrink-0 mx-auto md:mx-0">
            <img 
              :src="getImageUrl(show.poster_path, 'w500')" 
              :alt="show.name" 
              class="w-full h-auto object-cover"
            />
          </div>

          <!-- Right: Detailed Info -->
          <div class="flex-1 space-y-4 sm:space-y-5 text-center md:text-left">
            
            <!-- Category & Badges -->
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-2.5 text-xs font-semibold">
              <span class="px-2.5 py-1 bg-marxi-accent text-white font-bold rounded-lg uppercase tracking-wider text-[10px]">
                TV Series
              </span>

              <div v-if="show.vote_average" class="flex items-center space-x-1 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-marxi-gold border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-white font-bold">{{ show.vote_average.toFixed(1) }}</span>
              </div>

              <span v-if="show.number_of_seasons" class="px-2.5 py-1 bg-marxi-800 rounded-lg text-gray-300 border border-marxi-700">
                {{ show.number_of_seasons }} Seasons
              </span>

              <span v-if="show.number_of_episodes" class="px-2.5 py-1 bg-marxi-800 rounded-lg text-gray-300 border border-marxi-700">
                {{ show.number_of_episodes }} Episodes
              </span>
            </div>

            <!-- Title & Tagline -->
            <div class="space-y-1">
              <h1 class="text-2xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
                {{ show.name }}
              </h1>
              <p v-if="show.tagline" class="text-marxi-accent font-medium italic text-xs sm:text-base">
                "{{ show.tagline }}"
              </p>
            </div>

            <!-- Genres Pills -->
            <div v-if="show.genres && show.genres.length > 0" class="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
              <span 
                v-for="genre in show.genres" 
                :key="genre.id"
                class="px-2.5 py-1 bg-marxi-850 text-xs font-semibold text-gray-300 rounded-full border border-marxi-700"
              >
                {{ genre.name }}
              </span>
            </div>

            <!-- Action Buttons (Min 44px Touch Target) -->
            <div class="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
              <NuxtLink 
                :to="`/watch/tv/${show.id}/1/1`"
                class="px-6 py-3 sm:px-8 sm:py-3.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold rounded-xl flex items-center space-x-2.5 shadow-glow-red hover:scale-105 transition-all duration-200 min-h-[44px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
                <span>Start Watching (S1 E1)</span>
              </NuxtLink>

              <button 
                @click="toggleMyList(show)"
                class="px-5 py-3 sm:px-6 sm:py-3.5 bg-marxi-850 hover:bg-marxi-800 text-white font-semibold rounded-xl flex items-center space-x-2 border border-marxi-700 transition-colors min-h-[44px]"
              >
                <svg v-if="!inList" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-marxi-accent fill-current" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>{{ inList ? 'In My List' : 'Add to My List' }}</span>
              </button>
            </div>

            <!-- Overview -->
            <div class="space-y-1.5 pt-2 border-t border-marxi-800/80 text-left">
              <h3 class="text-white font-bold text-sm sm:text-base">Synopsis</h3>
              <p class="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                {{ show.overview || 'No synopsis available for this TV series.' }}
              </p>
            </div>

          </div>
        </div>

        <!-- Top Cast Section (Grid UI) -->
        <div v-if="topCast.length > 0" class="space-y-4 pt-6 border-t border-marxi-800">
          <div class="flex items-center space-x-3">
            <div class="w-1.5 h-6 bg-marxi-accent rounded-full"></div>
            <h2 class="font-display text-lg sm:text-2xl font-bold text-white tracking-tight">
              Top Cast & Starring
            </h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div 
              v-for="actor in topCast" 
              :key="actor.id"
              class="group relative bg-marxi-850 hover:bg-marxi-800 p-2.5 sm:p-3 rounded-2xl border border-marxi-800 hover:border-marxi-700 transition-all duration-300 flex items-center space-x-3"
            >
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-marxi-800 shrink-0 border border-marxi-700 shadow-md group-hover:scale-105 transition-transform">
                <img 
                  v-if="actor.profile_path"
                  :src="getImageUrl(actor.profile_path, 'w185')" 
                  :alt="actor.name"
                  class="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div v-else class="w-full h-full bg-gradient-to-tr from-marxi-800 to-marxi-700 flex items-center justify-center font-bold text-xs text-marxi-accent tracking-wider">
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

        <!-- Seasons & Episodes Section -->
        <div class="space-y-6 pt-6 border-t border-marxi-800">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 class="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              Seasons & Episodes
            </h2>

            <!-- Season Selector Tabs -->
            <SeasonSelector 
              v-if="show.seasons && show.seasons.length > 0"
              :seasons="show.seasons"
              v-model="selectedSeasonNumber"
            />
          </div>

          <!-- Loading Season Indicator -->
          <div v-if="loadingSeason" class="py-12 text-center space-y-3">
            <div class="w-8 h-8 border-4 border-marxi-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p class="text-xs text-gray-400">Fetching Season {{ selectedSeasonNumber }} details...</p>
          </div>

          <!-- Episode List -->
          <EpisodeList 
            v-else-if="currentSeasonDetails && currentSeasonDetails.episodes"
            :tvId="show.id"
            :seasonNumber="selectedSeasonNumber"
            :episodes="currentSeasonDetails.episodes"
            :backdropPath="show.backdrop_path"
          />

        </div>

        <!-- Similar TV Series (Grid Layout) -->
        <ContentRow 
          v-if="similarShows.length > 0"
          title="More TV Series Like This"
          :items="similarShows"
          layout="grid"
        />

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TVDetails, SeasonDetails, CastMember, MediaItem } from '~/types/tmdb';

definePageMeta({
  key: route => route.fullPath
});

const route = useRoute();
const tvId = computed(() => route.params.id as string);

const { getTVDetails, getSeasonDetails, getCredits, getSimilar, getImageUrl } = useTmdb();
const { isInList, toggleMyList } = useMyList();

const show = ref<TVDetails | null>(null);
const topCast = ref<CastMember[]>([]);
const similarShows = ref<MediaItem[]>([]);

const loading = ref(true);
const error = ref<string | null>(null);

const selectedSeasonNumber = ref(1);
const currentSeasonDetails = ref<SeasonDetails | null>(null);
const loadingSeason = ref(false);

const inList = computed(() => show.value ? isInList(show.value.id, 'tv') : false);

const getInitials = (name: string) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const fetchSeason = async (seasonNum: number) => {
  if (!show.value) return;
  loadingSeason.value = true;
  try {
    currentSeasonDetails.value = await getSeasonDetails(show.value.id, seasonNum);
  } catch (err) {
    console.error(`Error loading season ${seasonNum}:`, err);
  } finally {
    loadingSeason.value = false;
  }
};

watch(selectedSeasonNumber, (newNum) => {
  fetchSeason(newNum);
});

const loadData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [showData, creditsData, similarData] = await Promise.all([
      getTVDetails(tvId.value),
      getCredits('tv', tvId.value).catch(() => ({ cast: [], crew: [] })),
      getSimilar('tv', tvId.value).catch(() => ({ results: [] }))
    ]);

    show.value = showData;
    if (show.value) {
      useSeoMeta({
        title: `${show.value.name} - Stream TV Series on RHFlix`,
        ogTitle: `${show.value.name} - Stream TV Series on RHFlix`,
        description: show.value.overview,
        ogDescription: show.value.overview,
        ogImage: show.value.backdrop_path ? getImageUrl(show.value.backdrop_path, 'w500') : undefined
      });

      useHead({
        link: [
          { rel: 'canonical', href: `https://reflix.rehmanwebs.com/tv/${show.value.id}` }
        ],
        script: [
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'TVSeries',
              'name': show.value.name,
              'image': show.value.poster_path ? getImageUrl(show.value.poster_path, 'w500') : undefined,
              'description': show.value.overview,
              'numberOfSeasons': show.value.number_of_seasons,
              'numberOfEpisodes': show.value.number_of_episodes,
              'aggregateRating': show.value.vote_average ? {
                '@type': 'AggregateRating',
                'ratingValue': show.value.vote_average,
                'bestRating': 10,
                'ratingCount': show.value.vote_count || 100
              } : undefined
            })
          }
        ]
      });

      if (show.value.seasons && show.value.seasons.length > 0) {
        const firstValid = show.value.seasons.find(s => s.season_number > 0);
        selectedSeasonNumber.value = firstValid ? firstValid.season_number : 1;
      }
      await fetchSeason(selectedSeasonNumber.value);
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

  } catch (err: any) {
    error.value = err?.message || 'Failed to fetch TV details from TMDB.';
  } finally {
    loading.value = false;
  }
};

watch(() => tvId.value, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  loadData();
});

onMounted(() => {
  loadData();
});
</script>
