<template>
  <div>
    <!-- Hero Banner Section -->
    <LoadingSkeleton v-if="loadingHero" type="hero" />
    <Hero v-else-if="featuredItem" :item="featuredItem" />

    <div class="space-y-4 sm:space-y-6 pb-16 pt-4 sm:pt-6">
      
      <!-- Continue Watching Row -->
      <section v-if="watchHistoryItems && watchHistoryItems.length > 0" class="py-3 sm:py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="flex items-center space-x-2.5 sm:space-x-3">
              <div class="w-1.5 h-5 sm:h-6 bg-marxi-gold rounded-full"></div>
              <h2 class="font-display text-lg sm:text-2xl font-bold text-white tracking-tight">
                Continue Watching
              </h2>
            </div>
            <button 
              @click="clearHistory" 
              class="text-xs text-gray-400 hover:text-red-400 transition-colors py-1 px-2"
            >
              Clear History
            </button>
          </div>

          <div class="flex items-center space-x-3 sm:space-x-4 overflow-x-auto hide-scrollbar py-2 snap-x snap-mandatory">
            <div 
              v-for="item in watchHistoryItems" 
              :key="`${item.type}-${item.tmdbId}-${item.season || 0}-${item.episode || 0}`"
              class="group relative flex-none w-44 sm:w-56 bg-marxi-850 rounded-2xl overflow-hidden border border-marxi-800 hover:border-marxi-accent transition-all duration-300 shadow-md snap-start"
            >
              <!-- Remove Item Button -->
              <button 
                @click.stop.prevent="removeHistoryItem(item.tmdbId, item.type)"
                class="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-md opacity-0 group-hover:opacity-100"
                title="Remove from Continue Watching"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <NuxtLink :to="getWatchUrl(item)" class="block relative aspect-video bg-marxi-800 overflow-hidden">
                <img 
                  :src="getImageUrl(item.backdropPath || item.posterPath, 'w500')" 
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-marxi-950 via-black/20 to-black/40"></div>
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-marxi-accent text-white flex items-center justify-center shadow-glow-red">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              </NuxtLink>

              <div class="p-2.5 sm:p-3 space-y-0.5 sm:space-y-1">
                <h4 class="font-bold text-xs sm:text-sm text-white truncate group-hover:text-marxi-accent transition-colors">
                  {{ item.title }}
                </h4>
                <p class="text-[11px] sm:text-xs text-marxi-accent font-semibold truncate">
                  {{ item.type === 'tv' ? `S${item.season} E${item.episode}: ${item.episodeName || ''}` : 'Movie' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trending Movies -->
      <ContentRow 
        title="Trending Movies" 
        :items="trendingMovies" 
        :loading="loadingMovies"
        viewAllUrl="/movies?sort=trending"
      />

      <!-- Popular Movies -->
      <ContentRow 
        title="Popular Movies" 
        :items="popularMovies" 
        :loading="loadingMovies"
        viewAllUrl="/movies?sort=popular"
      />

      <!-- Upcoming Movies -->
      <ContentRow 
        title="Upcoming Movies" 
        :items="upcomingMovies" 
        :loading="loadingMovies"
        viewAllUrl="/movies?sort=upcoming"
      />

      <!-- Top Rated Movies -->
      <ContentRow 
        title="Top Rated Movies" 
        :items="topRatedMovies" 
        :loading="loadingMovies"
        viewAllUrl="/movies?sort=top_rated"
      />

      <!-- Popular TV Shows -->
      <ContentRow 
        title="Popular TV Shows" 
        :items="popularTv" 
        :loading="loadingTv"
        viewAllUrl="/tv?sort=popular"
      />

      <!-- Airing Today TV Shows -->
      <ContentRow 
        title="Airing Today" 
        :items="airingTodayTv" 
        :loading="loadingTv"
        viewAllUrl="/tv?sort=airing_today"
      />

      <!-- Trending TV Shows -->
      <ContentRow 
        title="Trending TV Shows" 
        :items="trendingTv" 
        :loading="loadingTv"
        viewAllUrl="/tv?sort=trending"
      />

      <!-- Top Rated TV Shows -->
      <ContentRow 
        title="Top Rated TV Shows" 
        :items="topRatedTv" 
        :loading="loadingTv"
        viewAllUrl="/tv?sort=top_rated"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { useTmdb } from '~/composables/useTmdb';
import { useWatchHistory } from '~/composables/useWatchHistory';
import type { MediaItem, WatchHistoryItem } from '~/types/tmdb';

useSeoMeta({
  title: 'RHFlix - Stream Unlimited Movies & TV Shows',
  ogTitle: 'RHFlix - Stream Unlimited Movies & TV Shows',
  description: 'Stream your favorite movies, top TV series, and trending blockbusters online on RHFlix in full HD.',
  ogDescription: 'Stream your favorite movies, top TV series, and trending blockbusters online on RHFlix in full HD.'
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'RHFlix',
        'url': 'https://reflix.rehmanwebs.com/',
        'description': 'Stream your favorite movies, top TV series, and trending blockbusters online on RHFlix in full HD.',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://reflix.rehmanwebs.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ]
});

const { getTrending, getPopular, getTopRated, getUpcoming, getAiringToday, getImageUrl } = useTmdb();
const { history, removeHistoryItem, clearHistory } = useWatchHistory();

const watchHistoryItems = computed(() => history.value);

const featuredItem = ref<MediaItem | null>(null);
const trendingMovies = ref<MediaItem[]>([]);
const popularMovies = ref<MediaItem[]>([]);
const upcomingMovies = ref<MediaItem[]>([]);
const topRatedMovies = ref<MediaItem[]>([]);

const trendingTv = ref<MediaItem[]>([]);
const popularTv = ref<MediaItem[]>([]);
const airingTodayTv = ref<MediaItem[]>([]);
const topRatedTv = ref<MediaItem[]>([]);

const loadingHero = ref(true);
const loadingMovies = ref(true);
const loadingTv = ref(true);

const getWatchUrl = (item: WatchHistoryItem) => {
  return item.type === 'movie' 
    ? `/watch/movie/${item.tmdbId}` 
    : `/watch/tv/${item.tmdbId}/${item.season || 1}/${item.episode || 1}`;
};

onMounted(async () => {
  try {
    const [tMovies, pMovies, uMovies, trMovies] = await Promise.all([
      getTrending('movie'),
      getPopular('movie'),
      getUpcoming(),
      getTopRated('movie')
    ]);

    trendingMovies.value = tMovies.results.map(i => ({ ...i, media_type: 'movie' }));
    popularMovies.value = pMovies.results.map(i => ({ ...i, media_type: 'movie' }));
    upcomingMovies.value = uMovies.results.map(i => ({ ...i, media_type: 'movie' }));
    topRatedMovies.value = trMovies.results.map(i => ({ ...i, media_type: 'movie' }));

    if (trendingMovies.value.length > 0) {
      featuredItem.value = trendingMovies.value[0];
    }
  } catch (err) {
    console.error('Error fetching home movies:', err);
  } finally {
    loadingHero.value = false;
    loadingMovies.value = false;
  }

  try {
    const [tTv, pTv, aTv, trTv] = await Promise.all([
      getTrending('tv'),
      getPopular('tv'),
      getAiringToday(),
      getTopRated('tv')
    ]);

    trendingTv.value = tTv.results.map(i => ({ ...i, media_type: 'tv' }));
    popularTv.value = pTv.results.map(i => ({ ...i, media_type: 'tv' }));
    airingTodayTv.value = aTv.results.map(i => ({ ...i, media_type: 'tv' }));
    topRatedTv.value = trTv.results.map(i => ({ ...i, media_type: 'tv' }));
  } catch (err) {
    console.error('Error fetching home TV shows:', err);
  } finally {
    loadingTv.value = false;
  }
});
</script>
