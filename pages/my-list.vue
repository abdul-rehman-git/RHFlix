<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
    
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-marxi-800 pb-5">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
          My List
        </h1>
        <p class="text-xs sm:text-sm text-gray-400 mt-1">
          Your personal collection of saved movies and TV series.
        </p>
      </div>

      <!-- Filter Tabs -->
      <div v-if="savedItems.length > 0" class="flex items-center space-x-2 bg-marxi-850 p-1.5 rounded-2xl border border-marxi-800">
        <button
          v-for="filter in filters"
          :key="filter.id"
          @click="activeFilter = filter.id"
          class="px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] flex items-center"
          :class="[
            activeFilter === filter.id
              ? 'bg-marxi-accent text-white shadow-glow-red'
              : 'text-gray-400 hover:text-white hover:bg-marxi-800'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Items Grid -->
    <div v-if="filteredItems.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-6">
      <ContentCard 
        v-for="item in filteredItems" 
        :key="`${item.media_type || 'item'}-${item.id}`" 
        :item="item" 
        :isGrid="true"
      />
    </div>

    <!-- Empty State -->
    <EmptyState 
      v-else 
      title="Your List is Empty" 
      description="You haven't saved any movies or TV series to your list yet. Click the bookmark icon on any title to save it for later."
    >
      <template #action>
        <NuxtLink 
          to="/movies" 
          class="px-6 py-3 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-sm rounded-xl shadow-glow-red inline-flex items-center space-x-2 transition-all min-h-[44px]"
        >
          <span>Explore Movies</span>
        </NuxtLink>
      </template>
    </EmptyState>

  </div>
</template>

<script setup lang="ts">
import { useMyList } from '~/composables/useMyList';
import type { MediaItem } from '~/types/tmdb';

useSeoMeta({
  title: 'My Watchlist - RHFlix',
  ogTitle: 'My Watchlist - RHFlix',
  description: 'View your saved movies and TV shows on RHFlix.'
});

const { myList } = useMyList();

const activeFilter = ref<'all' | 'movie' | 'tv'>('all');

const filters = [
  { id: 'all', label: 'All Items' },
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV Series' }
];

const savedItems = computed<MediaItem[]>(() => myList.value || []);

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return savedItems.value;
  return savedItems.value.filter(item => {
    const type = item.media_type || (item.title ? 'movie' : 'tv');
    return type === activeFilter.value;
  });
});
</script>
