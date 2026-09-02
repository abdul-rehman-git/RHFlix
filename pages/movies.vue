<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
    
    <!-- Page Header & Tabs -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 border-b border-marxi-800 pb-5">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
          Explore Movies
        </h1>
        <p class="text-xs sm:text-sm text-gray-400 mt-1">
          Browse popular, trending, and top-rated movies streaming on RHFlix.
        </p>
      </div>

      <!-- Sort Tabs -->
      <div class="flex items-center space-x-1.5 sm:space-x-2 bg-marxi-850 p-1.5 rounded-2xl border border-marxi-800 overflow-x-auto hide-scrollbar">
        <button 
          v-for="tab in sortTabs" 
          :key="tab.id"
          @click="changeTab(tab.id)"
          class="px-3.5 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap min-h-[40px] flex items-center"
          :class="[
            currentSort === tab.id 
              ? 'bg-marxi-accent text-white shadow-glow-red' 
              : 'text-gray-400 hover:text-white hover:bg-marxi-800'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- Genre Selector -->
    <div v-if="genres.length > 0" class="flex items-center space-x-2 overflow-x-auto hide-scrollbar py-1">
      <button
        @click="selectGenre(null)"
        class="px-3.5 py-2 rounded-full text-xs font-medium border transition-colors whitespace-nowrap min-h-[40px] flex items-center"
        :class="[
          selectedGenreId === null
            ? 'bg-white text-marxi-950 font-bold border-white'
            : 'bg-marxi-850 text-gray-300 border-marxi-700 hover:border-gray-500'
        ]"
      >
        All Genres
      </button>
      <button
        v-for="genre in genres"
        :key="genre.id"
        @click="selectGenre(genre.id)"
        class="px-3.5 py-2 rounded-full text-xs font-medium border transition-colors whitespace-nowrap min-h-[40px] flex items-center"
        :class="[
          selectedGenreId === genre.id
            ? 'bg-white text-marxi-950 font-bold border-white'
            : 'bg-marxi-850 text-gray-300 border-marxi-700 hover:border-gray-500'
        ]"
      >
        {{ genre.name }}
      </button>
    </div>

    <!-- Content Grid -->
    <div v-if="loading && items.length === 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-6">
      <LoadingSkeleton v-for="i in 12" :key="i" type="card" />
    </div>

    <div v-else-if="items.length > 0" class="space-y-8 sm:space-y-10">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-6">
        <ContentCard 
          v-for="item in items" 
          :key="`movie-${item.id}`" 
          :item="{ ...item, media_type: 'movie' }" 
          :isGrid="true"
        />
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="flex justify-center pt-4 sm:pt-6">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-8 py-3 bg-marxi-800 hover:bg-marxi-700 text-white font-bold text-sm rounded-xl border border-white/10 flex items-center space-x-2 transition-colors disabled:opacity-50 min-h-[44px]"
        >
          <span v-if="loadingMore" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ loadingMore ? 'Loading...' : 'Load More Movies' }}</span>
        </button>
      </div>
    </div>

    <EmptyState 
      v-else 
      title="No Movies Found" 
      description="We couldn't find any movies matching the selected criteria." 
    />
  </div>
</template>

<script setup lang="ts">
import type { MediaItem, Genre } from '~/types/tmdb';

useSeoMeta({
  title: 'Explore Popular Movies - RHFlix',
  ogTitle: 'Explore Popular Movies - RHFlix',
  description: 'Browse popular, trending, and top-rated movies streaming on RHFlix.',
  ogDescription: 'Browse popular, trending, and top-rated movies streaming on RHFlix.'
});

useHead({
  link: [
    { rel: 'canonical', href: 'https://reflix.rehmanwebs.com/movies' }
  ]
});

const route = useRoute();
const { getPopular, getTrending, getTopRated, getNowPlaying, getGenres, getByGenre } = useTmdb();

const currentSort = ref((route.query.sort as string) || 'popular');
const selectedGenreId = ref<number | null>(null);

const items = ref<MediaItem[]>([]);
const genres = ref<Genre[]>([]);
const page = ref(1);
const totalPages = ref(1);
const loading = ref(true);
const loadingMore = ref(false);

const sortTabs = [
  { id: 'popular', label: 'Popular' },
  { id: 'trending', label: 'Trending' },
  { id: 'top_rated', label: 'Top Rated' },
  { id: 'now_playing', label: 'Now Playing' }
];

const hasMore = computed(() => page.value < totalPages.value);

const fetchMovies = async (reset = true) => {
  if (reset) {
    page.value = 1;
    items.value = [];
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  try {
    let res;
    if (selectedGenreId.value !== null) {
      res = await getByGenre('movie', selectedGenreId.value, page.value);
    } else {
      switch (currentSort.value) {
        case 'trending':
          res = await getTrending('movie', page.value);
          break;
        case 'top_rated':
          res = await getTopRated('movie', page.value);
          break;
        case 'now_playing':
          res = await getNowPlaying(page.value);
          break;
        case 'popular':
        default:
          res = await getPopular('movie', page.value);
          break;
      }
    }

    totalPages.value = res.total_pages;
    if (reset) {
      items.value = res.results;
    } else {
      items.value.push(...res.results);
    }
  } catch (err) {
    console.error('Error fetching movies:', err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const changeTab = (tabId: string) => {
  currentSort.value = tabId;
  selectedGenreId.value = null;
  fetchMovies(true);
};

const selectGenre = (genreId: number | null) => {
  selectedGenreId.value = genreId;
  fetchMovies(true);
};

const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    page.value += 1;
    fetchMovies(false);
  }
};

onMounted(async () => {
  try {
    genres.value = await getGenres('movie');
  } catch (err) {
    console.error('Error loading genres:', err);
  }
  fetchMovies(true);
});
</script>
