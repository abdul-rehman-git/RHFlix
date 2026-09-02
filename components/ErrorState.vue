<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
    <div class="w-16 h-16 rounded-full bg-red-500/10 text-marxi-accent border border-marxi-accent/30 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>

    <div class="max-w-md space-y-2">
      <h3 class="font-display font-bold text-xl text-white">{{ title || 'Error Loading Content' }}</h3>
      <p class="text-sm text-gray-400 leading-relaxed">{{ message || 'An unexpected error occurred while communicating with TMDB or streaming services.' }}</p>
    </div>

    <div class="pt-2 flex items-center space-x-3">
      <button 
        v-if="retry" 
        @click="retry" 
        class="px-5 py-2.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-sm rounded-xl shadow-glow-red transition-all"
      >
        Try Again
      </button>
      <NuxtLink 
        to="/" 
        class="px-5 py-2.5 bg-marxi-800 hover:bg-marxi-700 text-white font-semibold text-sm rounded-xl border border-white/10 transition-colors"
      >
        Back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  message?: string;
  retry?: () => void;
}>();
</script>
