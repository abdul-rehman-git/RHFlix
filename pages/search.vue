<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
    
    <!-- Header & Search Input Container -->
    <div class="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
      <div class="space-y-1 sm:space-y-2">
        <h1 class="text-2xl sm:text-5xl font-display font-black text-white tracking-tight">
          Search RHFlix
        </h1>
        <p class="text-xs sm:text-sm text-gray-400">
          Find millions of movies, TV shows, and trending series on RHFlix.
        </p>
      </div>

      <!-- Main Search Input -->
      <div class="relative max-w-xl mx-auto">
        <input 
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Search for movies, TV series..."
          class="w-full bg-marxi-850 border border-marxi-700 text-sm sm:text-base text-white placeholder-gray-400 rounded-2xl py-3.5 sm:py-4 pl-11 pr-10 shadow-glow-card focus:outline-none focus:border-marxi-accent focus:ring-1 focus:ring-marxi-accent transition-all duration-300 min-h-[48px]"
          @input="handleInput"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <button 
          v-if="searchQuery"
          @click="clearQuery"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Clear Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Type Filter Tabs -->
      <div v-if="searchQuery" class="flex items-center justify-center space-x-2 pt-2">
        <button
          v-for="filter in typeFilters"
          :key="filter.id"
          @click="selectFilter(filter.id)"
          class="px-4 py-2 rounded-full text-xs font-bold transition-all border min-h-[40px] flex items-center"
          :class="[
            activeFilter === filter.id
              ? 'bg-marxi-accent text-white border-marxi-accent shadow-glow-red'
              : 'bg-marxi-850 text-gray-300 border-marxi-700 hover:border-gray-500'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-6">
      <LoadingSkeleton v-for="i in 12" :key="i" type="card" />
    </div>

    <!-- Search Results Grid -->
    <div v-else-if="filteredResults.length > 0" class="space-y-4 sm:space-y-6">
      <div class="flex items-center justify-between text-xs text-gray-400 border-b border-marxi-800 pb-3">
        <span>Found {{ filteredResults.length }} results for "<strong class="text-white">{{ searchQuery }}</strong>"</span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-6">
        <ContentCard 
          v-for="item in filteredResults" 
          :key="`${item.media_type || 'item'}-${item.id}`" 
          :item="item" 
          :isGrid="true"
        />
      </div>
    </div>

    <!-- Empty Results State -->
    <EmptyState 
      v-else-if="searchQuery && !loading" 
      title="No Results Found" 
      :description="`We couldn't find any content matching '${searchQuery}'. Try another search term.`" 
    />

    <!-- Initial Search Prompt State -->
    <div v-else class="text-center py-12 sm:py-16 space-y-4">
      <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-marxi-850 border border-marxi-700 flex items-center justify-center mx-auto text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="font-display font-bold text-base sm:text-lg text-white">Start typing to search</h3>
      <p class="text-xs text-gray-400 max-w-sm mx-auto">
        Search for movie titles like "Inception", "Interstellar", or TV shows like "Game of Thrones".
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { MediaItem } from '~/types/tmdb';

useSeoMeta({
  title: 'Search Movies & TV Shows - RHFlix',
  ogTitle: 'Search Movies & TV Shows - RHFlix',
  description: 'Search across millions of movies and TV series on RHFlix.',
  ogDescription: 'Search across millions of movies and TV series on RHFlix.'
});

useHead({
  link: [
    { rel: 'canonical', href: 'https://reflix.rehmanwebs.com/search' }
  ]
});

const route = useRoute();
const router = useRouter();
const { search } = useTmdb();

const searchInputRef = ref<HTMLInputElement | null>(null);
const searchQuery = ref((route.query.q as string) || '');
const activeFilter = ref<'all' | 'movie' | 'tv'>('all');
const rawResults = ref<MediaItem[]>([]);
const loading = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const typeFilters = [
  { id: 'all', label: 'All Results' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV Shows' }
];

const filteredResults = computed(() => {
  if (activeFilter.value === 'all') return rawResults.value;
  return rawResults.value.filter(item => {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    return type === activeFilter.value;
  });
});

const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    rawResults.value = [];
    return;
  }

  loading.value = true;
  try {
    const res = await search(searchQuery.value.trim());
    rawResults.value = res.results.map(item => ({
      ...item,
      media_type: item.media_type || (item.title ? 'movie' : 'tv')
    }));
  } catch (err) {
    console.error('Search error:', err);
    rawResults.value = [];
  } finally {
    loading.value = false;
  }
};

const handleInput = () => {
  if (debounceTimer) clearTimeout(debounceTimer);
  
  router.replace({ query: searchQuery.value.trim() ? { q: searchQuery.value.trim() } : {} });

  debounceTimer = setTimeout(() => {
    performSearch();
  }, 400);
};

const selectFilter = (filterId: any) => {
  activeFilter.value = filterId;
};

const clearQuery = () => {
  searchQuery.value = '';
  rawResults.value = [];
  router.replace({ query: {} });
  nextTick(() => {
    searchInputRef.value?.focus();
  });
};

onMounted(() => {
  nextTick(() => {
    searchInputRef.value?.focus();
  });

  if (searchQuery.value) {
    performSearch();
  }
});
</script>
