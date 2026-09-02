<template>
  <div 
    v-if="!isWatchPage" 
    class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-marxi-950/95 backdrop-blur-xl border-t border-marxi-800/80 shadow-2xl transition-all duration-300 pb-[env(safe-area-inset-bottom)]"
  >
    <nav class="grid grid-cols-5 h-16 items-center px-1">
      
      <!-- Home Tab -->
      <NuxtLink 
        to="/" 
        class="flex flex-col items-center justify-center space-y-1 py-1 transition-colors min-h-[44px]"
        :class="[route.path === '/' ? 'text-marxi-accent font-bold' : 'text-gray-400 hover:text-white']"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="text-[10px] tracking-tight">Home</span>
      </NuxtLink>

      <!-- Movies Tab -->
      <NuxtLink 
        to="/movies" 
        class="flex flex-col items-center justify-center space-y-1 py-1 transition-colors min-h-[44px]"
        :class="[route.path.startsWith('/movies') || route.path.startsWith('/movie') ? 'text-marxi-accent font-bold' : 'text-gray-400 hover:text-white']"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
        <span class="text-[10px] tracking-tight">Movies</span>
      </NuxtLink>

      <!-- TV Shows Tab -->
      <NuxtLink 
        to="/tv" 
        class="flex flex-col items-center justify-center space-y-1 py-1 transition-colors min-h-[44px]"
        :class="[route.path.startsWith('/tv') ? 'text-marxi-accent font-bold' : 'text-gray-400 hover:text-white']"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span class="text-[10px] tracking-tight">TV Shows</span>
      </NuxtLink>

      <!-- Search Tab -->
      <NuxtLink 
        to="/search" 
        class="flex flex-col items-center justify-center space-y-1 py-1 transition-colors min-h-[44px]"
        :class="[route.path === '/search' ? 'text-marxi-accent font-bold' : 'text-gray-400 hover:text-white']"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span class="text-[10px] tracking-tight">Search</span>
      </NuxtLink>

      <!-- My List Tab -->
      <NuxtLink 
        to="/my-list" 
        class="relative flex flex-col items-center justify-center space-y-1 py-1 transition-colors min-h-[44px]"
        :class="[route.path === '/my-list' ? 'text-marxi-accent font-bold' : 'text-gray-400 hover:text-white']"
      >
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span 
            v-if="myListCount > 0" 
            class="absolute -top-1 -right-2 px-1 py-0.2 text-[9px] bg-marxi-accent text-white font-extrabold rounded-full min-w-[14px] text-center"
          >
            {{ myListCount }}
          </span>
        </div>
        <span class="text-[10px] tracking-tight">My List</span>
      </NuxtLink>

    </nav>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { myList } = useMyList();

const myListCount = computed(() => myList.value?.length || 0);
const isWatchPage = computed(() => route.path.startsWith('/watch/'));
</script>
