<template>
  <section class="py-4 sm:py-6 relative group/row">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Row Header -->
      <div class="flex items-center justify-between mb-3 sm:mb-4">
        <div class="flex items-center space-x-2.5 sm:space-x-3">
          <div class="w-1.5 h-5 sm:h-6 bg-marxi-accent rounded-full"></div>
          <h2 class="font-display text-lg sm:text-2xl font-bold text-white tracking-tight">
            {{ title }}
          </h2>
        </div>

        <NuxtLink 
          v-if="viewAllUrl" 
          :to="viewAllUrl" 
          class="text-xs font-semibold text-gray-400 hover:text-marxi-accent flex items-center space-x-1 transition-colors py-1 px-2"
        >
          <span>View All</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Grid Layout Mode -->
      <div v-if="layout === 'grid'">
        <div v-if="items && items.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
          <ContentCard 
            v-for="item in items" 
            :key="`${item.media_type || 'item'}-${item.id}`" 
            :item="item"
            :isGrid="true" 
          />
        </div>
        <div v-else-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6">
          <LoadingSkeleton v-for="i in 6" :key="i" type="card" />
        </div>
      </div>

      <!-- Scrollable Row Layout Mode -->
      <div v-else class="relative">
        
        <!-- Left Arrow Scroll Button (Desktop) -->
        <button 
          @click="scroll('left')"
          class="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-marxi-950/90 text-white border border-marxi-700 items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-marxi-accent transition-all duration-300 shadow-lg"
          aria-label="Scroll Left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Right Arrow Scroll Button (Desktop) -->
        <button 
          @click="scroll('right')"
          class="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-marxi-950/90 text-white border border-marxi-700 items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-marxi-accent transition-all duration-300 shadow-lg"
          aria-label="Scroll Right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Scrollable Touch Track -->
        <div 
          ref="scrollContainer"
          class="flex items-center space-x-3 sm:space-x-4 overflow-x-auto scroll-smooth hide-scrollbar py-2 px-1 snap-x snap-mandatory"
        >
          <template v-if="items && items.length > 0">
            <ContentCard 
              v-for="item in items" 
              :key="`${item.media_type || 'item'}-${item.id}`" 
              :item="item" 
            />
          </template>
          <template v-else-if="loading">
            <LoadingSkeleton v-for="i in 6" :key="i" type="card" />
          </template>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { MediaItem } from '~/types/tmdb';

const props = withDefaults(defineProps<{
  title: string;
  items?: MediaItem[];
  loading?: boolean;
  viewAllUrl?: string;
  layout?: 'row' | 'grid';
}>(), {
  layout: 'row'
});

const scrollContainer = ref<HTMLElement | null>(null);

const scroll = (direction: 'left' | 'right') => {
  if (scrollContainer.value) {
    const scrollAmount = direction === 'left' ? -500 : 500;
    scrollContainer.value.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
};
</script>
