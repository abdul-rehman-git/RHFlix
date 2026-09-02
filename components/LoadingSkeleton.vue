<template>
  <!-- Card Skeleton -->
  <div v-if="type === 'card'" class="flex-none w-40 sm:w-48 lg:w-56 bg-marxi-850 rounded-2xl overflow-hidden border border-marxi-800 animate-pulse">
    <div class="aspect-[2/3] bg-marxi-800 w-full"></div>
    <div class="p-3.5 space-y-2">
      <div class="h-4 bg-marxi-800 rounded w-3/4"></div>
      <div class="h-3 bg-marxi-800 rounded w-1/2"></div>
    </div>
  </div>

  <!-- Hero Skeleton -->
  <div v-else-if="type === 'hero'" class="w-full h-[60vh] min-h-[450px] bg-marxi-950 animate-pulse relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
      <div class="max-w-xl space-y-4 w-full">
        <div class="h-6 bg-marxi-800 rounded w-32"></div>
        <div class="h-12 bg-marxi-800 rounded w-3/4"></div>
        <div class="h-16 bg-marxi-800 rounded w-full"></div>
        <div class="flex space-x-4">
          <div class="h-12 bg-marxi-800 rounded-xl w-36"></div>
          <div class="h-12 bg-marxi-800 rounded-xl w-36"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Detail Page Skeleton -->
  <div v-else-if="type === 'detail'" class="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-8">
    <div class="flex flex-col md:flex-row gap-8">
      <div class="w-64 h-96 bg-marxi-800 rounded-2xl shrink-0"></div>
      <div class="flex-1 space-y-4">
        <div class="h-10 bg-marxi-800 rounded w-2/3"></div>
        <div class="h-6 bg-marxi-800 rounded w-1/3"></div>
        <div class="h-24 bg-marxi-800 rounded w-full"></div>
        <div class="h-12 bg-marxi-800 rounded-xl w-48"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'card' | 'hero' | 'detail';
}>();
</script>
