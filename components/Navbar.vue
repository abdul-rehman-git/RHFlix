<template>
  <header 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[
      mobileMenuOpen 
        ? 'bg-marxi-950 border-b border-marxi-800 shadow-2xl py-3' 
        : (isScrolled ? 'glass-nav shadow-lg py-3' : 'bg-gradient-to-b from-marxi-950/95 via-marxi-950/60 to-transparent py-4 sm:py-5')
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between">
        
        <!-- Left Section: Logo & Desktop Links -->
        <div class="flex items-center space-x-8">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2 group">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-marxi-accent to-red-500 flex items-center justify-center shadow-glow-red group-hover:scale-105 transition-transform duration-300">
              <span class="font-display font-black text-lg text-white tracking-tighter">RH</span>
            </div>
            <span class="font-display font-extrabold text-2xl tracking-tight text-white group-hover:text-red-400 transition-colors">
              RHFlix<span class="text-marxi-accent">.</span>
            </span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-6">
            <NuxtLink 
              to="/" 
              class="text-sm font-medium transition-colors hover:text-white"
              :class="[route.path === '/' ? 'text-white font-semibold' : 'text-gray-400']"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/movies" 
              class="text-sm font-medium transition-colors hover:text-white"
              :class="[route.path.startsWith('/movies') || route.path.startsWith('/movie') ? 'text-white font-semibold' : 'text-gray-400']"
            >
              Movies
            </NuxtLink>
            <NuxtLink 
              to="/tv" 
              class="text-sm font-medium transition-colors hover:text-white"
              :class="[route.path.startsWith('/tv') ? 'text-white font-semibold' : 'text-gray-400']"
            >
              TV Shows
            </NuxtLink>
            <NuxtLink 
              to="/my-list" 
              class="text-sm font-medium transition-colors hover:text-white flex items-center space-x-1.5"
              :class="[route.path === '/my-list' ? 'text-white font-semibold' : 'text-gray-400']"
            >
              <span>My List</span>
              <span v-if="myListCount > 0" class="px-1.5 py-0.5 text-xs bg-marxi-accent text-white font-bold rounded-full">
                {{ myListCount }}
              </span>
            </NuxtLink>
          </nav>
        </div>

        <!-- Right Section: Search Bar & Mobile Menu Toggle -->
        <div class="flex items-center space-x-3 sm:space-x-4" ref="searchContainerRef">
          <!-- Search Bar Trigger / Direct Input with Auto-complete (Desktop) -->
          <div class="relative hidden sm:block">
            <form @submit.prevent="handleSearchSubmit" class="relative flex items-center">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Search movies, TV shows..."
                class="w-48 lg:w-64 bg-marxi-800/80 border border-marxi-700 text-sm text-gray-200 placeholder-gray-400 rounded-full py-2 pl-9 pr-4 focus:outline-none focus:border-marxi-accent focus:w-72 transition-all duration-300"
                @input="handleInput"
                @focus="handleFocus"
                @keydown.down.prevent="onKeyDown"
                @keydown.up.prevent="onKeyUp"
                @keydown.enter.prevent="onKeyEnter"
                @keydown.esc="onKeyEsc"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </form>

            <!-- Search Suggestions Dropdown -->
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 -translate-y-2"
            >
              <div 
                v-if="showSuggestions && (suggestions.length > 0 || loadingSuggestions)" 
                class="absolute top-full right-0 mt-2 w-80 lg:w-96 bg-marxi-850/95 border border-marxi-700/80 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl z-50"
              >
                <!-- Loading State -->
                <div v-if="loadingSuggestions" class="p-4 text-center text-xs text-gray-400 space-y-2">
                  <div class="w-5 h-5 border-2 border-marxi-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p>Searching suggestions...</p>
                </div>

                <!-- Suggestions List -->
                <div v-else-if="suggestions.length > 0" class="divide-y divide-marxi-800/60 max-h-[70vh] overflow-y-auto">
                  <div class="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-black/40 flex items-center justify-between">
                    <span>Search Suggestions</span>
                    <span class="text-[9px] text-gray-500 font-normal">Use ↑ ↓ & Enter</span>
                  </div>

                  <div
                    v-for="(item, index) in suggestions"
                    :key="`${item.media_type || 'item'}-${item.id}`"
                    @click="goToItem(item)"
                    @mouseenter="selectedIndex = index"
                    class="flex items-center space-x-3 p-2.5 cursor-pointer transition-all group border-l-4"
                    :class="[
                      selectedIndex === index
                        ? 'bg-marxi-800/90 border-marxi-accent text-white pl-3.5 shadow-md'
                        : 'border-transparent hover:bg-marxi-800/50'
                    ]"
                  >
                    <!-- Poster Thumbnail -->
                    <div class="w-10 h-14 rounded-md overflow-hidden bg-marxi-800 shrink-0 border border-marxi-700">
                      <img 
                        :src="getImageUrl(item.poster_path, 'w185')" 
                        :alt="item.title || item.name" 
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <!-- Title & Details -->
                    <div class="flex-1 min-w-0">
                      <h5 
                        class="text-xs font-bold truncate transition-colors"
                        :class="[selectedIndex === index ? 'text-marxi-accent' : 'text-white group-hover:text-marxi-accent']"
                      >
                        {{ item.title || item.name }}
                      </h5>
                      <div class="flex items-center space-x-2 text-[10px] text-gray-400 mt-0.5">
                        <span class="px-1.5 py-0.5 bg-marxi-700/60 rounded text-gray-300 font-semibold uppercase text-[9px]">
                          {{ item.media_type || (item.title ? 'Movie' : 'TV') }}
                        </span>
                        <span v-if="item.release_date || item.first_air_date">
                          {{ (item.release_date || item.first_air_date || '').substring(0, 4) }}
                        </span>
                        <span v-if="item.vote_average" class="text-marxi-gold flex items-center">
                          ★ {{ item.vote_average.toFixed(1) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Footer link to full search -->
                  <div 
                    @click="handleSearchSubmit"
                    @mouseenter="selectedIndex = suggestions.length"
                    class="p-2.5 text-center text-xs font-bold transition-all cursor-pointer border-l-4"
                    :class="[
                      selectedIndex === suggestions.length
                        ? 'bg-marxi-accent/20 border-marxi-accent text-white font-black'
                        : 'border-transparent text-marxi-accent hover:bg-marxi-800 bg-black/20'
                    ]"
                  >
                    View all results for "{{ searchQuery }}" →
                  </div>
                </div>

              </div>
            </transition>
          </div>

          <!-- Mobile Search Icon Button -->
          <NuxtLink 
            to="/search" 
            class="sm:hidden p-2 text-gray-300 hover:text-white rounded-xl hover:bg-marxi-850 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </NuxtLink>

          <!-- Mobile Hamburger Button -->
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-marxi-850 focus:outline-none transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Solid Dropdown Navigation Overlay -->
      <transition 
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div 
          v-if="mobileMenuOpen" 
          class="md:hidden mt-3 pt-3 pb-4 border-t border-marxi-800/80 space-y-2 bg-marxi-950 rounded-2xl px-2 shadow-2xl"
        >
          <NuxtLink 
            to="/" 
            @click="mobileMenuOpen = false"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
            :class="[route.path === '/' ? 'bg-marxi-accent text-white font-bold shadow-glow-red' : 'text-gray-300 hover:bg-marxi-850 hover:text-white']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011.414-1.414L12 3.586l7.293 7.293a1 1 0 01.1414 1.414z" />
            </svg>
            <span>Home</span>
          </NuxtLink>

          <NuxtLink 
            to="/movies" 
            @click="mobileMenuOpen = false"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
            :class="[route.path.startsWith('/movies') || route.path.startsWith('/movie') ? 'bg-marxi-accent text-white font-bold shadow-glow-red' : 'text-gray-300 hover:bg-marxi-850 hover:text-white']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h18M3 16h18" />
            </svg>
            <span>Movies</span>
          </NuxtLink>

          <NuxtLink 
            to="/tv" 
            @click="mobileMenuOpen = false"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
            :class="[route.path.startsWith('/tv') ? 'bg-marxi-accent text-white font-bold shadow-glow-red' : 'text-gray-300 hover:bg-marxi-850 hover:text-white']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>TV Shows</span>
          </NuxtLink>

          <NuxtLink 
            to="/my-list" 
            @click="mobileMenuOpen = false"
            class="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all"
            :class="[route.path === '/my-list' ? 'bg-marxi-accent text-white font-bold shadow-glow-red' : 'text-gray-300 hover:bg-marxi-850 hover:text-white']"
          >
            <div class="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span>My List</span>
            </div>
            <span v-if="myListCount > 0" class="px-2.5 py-0.5 text-xs bg-marxi-accent text-white font-bold rounded-full border border-white/20">
              {{ myListCount }}
            </span>
          </NuxtLink>

          <NuxtLink 
            to="/search" 
            @click="mobileMenuOpen = false"
            class="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
            :class="[route.path === '/search' ? 'bg-marxi-accent text-white font-bold shadow-glow-red' : 'text-gray-300 hover:bg-marxi-850 hover:text-white']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
          </NuxtLink>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { MediaItem } from '~/types/tmdb';

const route = useRoute();
const router = useRouter();

const { search, getImageUrl } = useTmdb();
const { myList } = useMyList();

const searchQuery = ref('');
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

const suggestions = ref<MediaItem[]>([]);
const showSuggestions = ref(false);
const loadingSuggestions = ref(false);
const selectedIndex = ref(-1);
const searchContainerRef = ref<HTMLElement | null>(null);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

const myListCount = computed(() => myList.value?.length || 0);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const fetchSuggestions = async () => {
  const query = searchQuery.value.trim();
  if (!query) {
    suggestions.value = [];
    showSuggestions.value = false;
    loadingSuggestions.value = false;
    selectedIndex.value = -1;
    return;
  }

  loadingSuggestions.value = true;
  showSuggestions.value = true;

  try {
    const res = await search(query);
    suggestions.value = (res.results || []).slice(0, 6).map(item => ({
      ...item,
      media_type: item.media_type || (item.title ? 'movie' : 'tv')
    }));
    selectedIndex.value = -1;
  } catch (err) {
    console.error('Error fetching search suggestions:', err);
    suggestions.value = [];
    selectedIndex.value = -1;
  } finally {
    loadingSuggestions.value = false;
  }
};

const handleInput = () => {
  selectedIndex.value = -1;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchSuggestions();
  }, 300);
};

const handleFocus = () => {
  if (searchQuery.value.trim() && suggestions.value.length > 0) {
    showSuggestions.value = true;
  }
};

const onKeyDown = () => {
  if (!showSuggestions.value || suggestions.value.length === 0) return;
  if (selectedIndex.value < suggestions.value.length) {
    selectedIndex.value++;
  } else {
    selectedIndex.value = 0;
  }
};

const onKeyUp = () => {
  if (!showSuggestions.value || suggestions.value.length === 0) return;
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  } else if (selectedIndex.value === 0) {
    selectedIndex.value = -1;
  } else {
    selectedIndex.value = suggestions.value.length;
  }
};

const onKeyEnter = () => {
  if (showSuggestions.value && selectedIndex.value >= 0) {
    if (selectedIndex.value < suggestions.value.length) {
      goToItem(suggestions.value[selectedIndex.value]);
    } else {
      handleSearchSubmit();
    }
  } else {
    handleSearchSubmit();
  }
};

const onKeyEsc = () => {
  showSuggestions.value = false;
  selectedIndex.value = -1;
};

const goToItem = (item: MediaItem) => {
  const type = item.media_type || (item.title ? 'movie' : 'tv');
  showSuggestions.value = false;
  searchQuery.value = '';
  selectedIndex.value = -1;
  if (type === 'movie') {
    router.push(`/movie/${item.id}`);
  } else {
    router.push(`/tv/${item.id}`);
  }
};

const handleSearchSubmit = () => {
  if (searchQuery.value.trim()) {
    showSuggestions.value = false;
    selectedIndex.value = -1;
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } });
    searchQuery.value = '';
  }
};

const handleClickOutside = (event: MouseEvent) => {
  if (searchContainerRef.value && !searchContainerRef.value.contains(event.target as Node)) {
    showSuggestions.value = false;
    selectedIndex.value = -1;
  }
};

watch(() => route.path, () => {
  mobileMenuOpen.value = false;
  showSuggestions.value = false;
  selectedIndex.value = -1;
});

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleClickOutside);
  }
});
</script>
