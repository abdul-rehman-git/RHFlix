<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
    
    <!-- Top Header & Search/Reset Bar -->
    <div class="flex items-center justify-between gap-3 border-b border-marxi-800/80 pb-3">
      <div>
        <h1 class="text-xl sm:text-3xl font-display font-black text-white tracking-tight flex items-center space-x-2">
          <span>Explore Categories</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-marxi-accent/20 border border-marxi-accent/40 text-marxi-accent font-sans font-bold">
            {{ items.length }} Titles
          </span>
        </h1>
        <p class="text-xs text-gray-400 hidden sm:block mt-0.5">
          Stream K-Dramas, Anime, Bollywood, Action, Romance, Turkish Serials & 18+ Mature content.
        </p>
      </div>

      <!-- Quick Reset Filters Button -->
      <button 
        v-if="hasActiveFilters"
        @click="resetFilters" 
        class="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-marxi-850 hover:bg-marxi-800 text-marxi-gold text-xs font-bold rounded-xl border border-marxi-gold/30 transition-all shrink-0 min-h-[36px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Reset</span>
      </button>
    </div>

    <!-- Sticky Sleek Glassmorphic Bar (Presets + Quick Controls) -->
    <div class="sticky top-16 z-30 space-y-3 bg-marxi-950/90 backdrop-blur-xl p-3 sm:p-4 rounded-2xl border border-white/10 shadow-2xl">
      
      <!-- Preset Chips Horizontal Ribbon (Scrollable) -->
      <div class="flex items-center space-x-2 overflow-x-auto hide-scrollbar pb-1">
        <button 
          v-for="preset in PRESETS" 
          :key="preset.id"
          @click="applyPreset(preset)"
          class="px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center space-x-1.5 min-h-[38px] shadow-sm"
          :class="[
            isPresetActive(preset)
              ? 'bg-gradient-to-r from-marxi-accent to-red-700 text-white border-marxi-accent shadow-glow-red scale-[1.02]'
              : 'bg-marxi-850/90 text-gray-300 border-marxi-800 hover:border-marxi-700 hover:text-white'
          ]"
        >
          <span>{{ preset.icon }}</span>
          <span>{{ preset.label }}</span>
        </button>
      </div>

      <!-- Action Line: Media Type Toggle, Language Select, Sort, 18+ Toggle -->
      <div class="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-marxi-800/60 text-xs">
        
        <!-- Media Type Selector (Movies / TV) -->
        <div class="flex items-center space-x-1 bg-marxi-900 p-1 rounded-xl border border-marxi-800 shrink-0">
          <button 
            v-for="t in MEDIA_TYPES" 
            :key="t.id"
            @click="setMediaType(t.id)"
            class="px-3 py-1 rounded-lg text-xs font-bold transition-all min-h-[32px]"
            :class="[
              selectedType === t.id
                ? 'bg-marxi-accent text-white font-black shadow-sm'
                : 'text-gray-400 hover:text-white'
            ]"
          >
            {{ t.label }}
          </button>
        </div>

        <!-- Filter Toggle & Controls Group -->
        <div class="flex items-center space-x-2 overflow-x-auto hide-scrollbar">
          
          <!-- More Filters Expand Button -->
          <button 
            @click="showFiltersDrawer = !showFiltersDrawer"
            class="px-3 py-1.5 rounded-xl border font-bold flex items-center space-x-1.5 min-h-[34px] transition-colors shrink-0"
            :class="[
              showFiltersDrawer || selectedGenreId || selectedLanguage
                ? 'bg-marxi-gold text-black border-marxi-gold'
                : 'bg-marxi-850 text-gray-300 border-marxi-800 hover:text-white'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Filters</span>
            <span v-if="selectedGenreId || selectedLanguage" class="w-2 h-2 rounded-full bg-black"></span>
          </button>

          <!-- Sort Select Dropdown -->
          <select 
            v-model="selectedSort"
            @change="fetchMedia(true)"
            class="bg-marxi-850 border border-marxi-800 text-white text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-marxi-accent min-h-[34px]"
          >
            <option value="popularity.desc">🔥 Most Popular</option>
            <option value="vote_average.desc">⭐ Top Rated</option>
            <option value="primary_release_date.desc">📅 Latest</option>
          </select>

          <!-- 18+ Toggle Chip -->
          <label class="flex items-center space-x-1.5 cursor-pointer bg-marxi-850 hover:bg-marxi-800 px-3 py-1.5 rounded-xl border border-marxi-800 transition-colors shrink-0 min-h-[34px]">
            <input 
              type="checkbox" 
              v-model="includeAdult" 
              @change="fetchMedia(true)"
              class="w-3.5 h-3.5 accent-marxi-accent rounded cursor-pointer"
            />
            <span class="font-bold text-red-400 text-xs flex items-center space-x-1">
              <span>🔞</span>
              <span class="hidden xs:inline">18+</span>
            </span>
          </label>
        </div>

      </div>

      <!-- Expandable Filters Panel (Genres & Languages) -->
      <div v-if="showFiltersDrawer" class="pt-3 border-t border-marxi-800/80 space-y-3 text-xs animate-fadeIn">
        
        <!-- Regional Languages -->
        <div class="space-y-1.5">
          <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Languages & Regions</span>
          <div class="flex items-center space-x-1.5 overflow-x-auto hide-scrollbar pb-1">
            <button 
              v-for="lang in LANGUAGES" 
              :key="lang.id"
              @click="setLanguage(lang.id)"
              class="px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all border flex items-center space-x-1"
              :class="[
                selectedLanguage === lang.id
                  ? 'bg-marxi-gold text-black border-marxi-gold font-bold'
                  : 'bg-marxi-900 text-gray-300 border-marxi-800 hover:text-white'
              ]"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
            </button>
          </div>
        </div>

        <!-- Genres Strip -->
        <div class="space-y-1.5">
          <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Genres</span>
          <div class="flex items-center space-x-1.5 overflow-x-auto hide-scrollbar pb-1">
            <button 
              @click="setGenre(null)"
              class="px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all border"
              :class="[
                selectedGenreId === null
                  ? 'bg-white text-black font-bold border-white'
                  : 'bg-marxi-900 text-gray-300 border-marxi-800 hover:text-white'
              ]"
            >
              All Genres
            </button>
            <button 
              v-for="genre in allGenres" 
              :key="genre.id"
              @click="setGenre(genre.id)"
              class="px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all border"
              :class="[
                selectedGenreId === genre.id
                  ? 'bg-marxi-accent text-white font-bold border-marxi-accent'
                  : 'bg-marxi-900 text-gray-300 border-marxi-800 hover:text-white'
              ]"
            >
              {{ genre.name }}
            </button>
          </div>
        </div>

      </div>

    </div>

    <!-- Content Grid -->
    <div v-if="loading && items.length === 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
      <LoadingSkeleton v-for="i in 12" :key="i" type="card" />
    </div>

    <div v-else-if="items.length > 0" class="space-y-6 sm:space-y-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
        <ContentCard 
          v-for="item in items" 
          :key="`${item.media_type || selectedType}-${item.id}`" 
          :item="{ ...item, media_type: item.media_type || selectedType }" 
          :isGrid="true"
        />
      </div>

      <!-- Load More Pagination Button -->
      <div v-if="hasMore" class="flex justify-center pt-2 sm:pt-4">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="px-6 py-3 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold text-xs rounded-xl shadow-glow-red flex items-center space-x-2 transition-all disabled:opacity-50 min-h-[40px]"
        >
          <span v-if="loadingMore" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>{{ loadingMore ? 'Loading More Titles...' : 'Load More Results' }}</span>
        </button>
      </div>
    </div>

    <!-- Empty Results State -->
    <EmptyState 
      v-else 
      title="No Titles Found" 
      description="We couldn't find any content matching your selected categories. Try resetting filters." 
    >
      <template #action>
        <button 
          @click="resetFilters" 
          class="px-6 py-2.5 bg-marxi-accent text-white font-bold text-xs rounded-xl shadow-glow-red min-h-[40px]"
        >
          Reset All Filters
        </button>
      </template>
    </EmptyState>

  </div>
</template>

<script setup lang="ts">
import { useTmdb } from '~/composables/useTmdb';
import type { MediaItem, Genre, MediaType } from '~/types/tmdb';

useSeoMeta({
  title: 'Categories & Regional Explore - RHFlix',
  ogTitle: 'Categories & Regional Explore - RHFlix',
  description: 'Browse K-Dramas, Anime, Action, Romance, Bollywood, Turkish, 18+ and top genres on RHFlix.',
  ogDescription: 'Browse K-Dramas, Anime, Action, Romance, Bollywood, Turkish, 18+ and top genres on RHFlix.',
  ogUrl: 'https://rhflix.rehmanwebs.com/categories',
  twitterCard: 'summary_large_image'
});

useHead({
  link: [
    { rel: 'canonical', href: 'https://rhflix.rehmanwebs.com/categories' }
  ]
});

const route = useRoute();
const router = useRouter();
const { getGenres, discoverMedia } = useTmdb();

const PRESETS = [
  { id: 'all', label: 'All Content', icon: '🎬', type: 'movie' as MediaType },
  { id: 'k-drama', label: 'K-Dramas', icon: '🇰🇷', lang: 'ko', type: 'tv' as MediaType },
  { id: 'anime', label: 'Anime', icon: '🇯🇵', lang: 'ja', genre: 16, type: 'tv' as MediaType },
  { id: 'bollywood', label: 'Bollywood', icon: '🇮🇳', lang: 'hi', type: 'movie' as MediaType },
  { id: 'action', label: 'Action', icon: '💥', genre: 28, type: 'movie' as MediaType },
  { id: 'romance', label: 'Romance', icon: '💖', genre: 10749, type: 'movie' as MediaType },
  { id: 'scifi', label: 'Sci-Fi', icon: '🚀', genre: 878, type: 'movie' as MediaType },
  { id: 'turkish', label: 'Turkish', icon: '🇹🇷', lang: 'tr', type: 'tv' as MediaType },
  { id: '18plus', label: '18+ Mature', icon: '🔞', adult: true, type: 'movie' as MediaType }
];

const MEDIA_TYPES = [
  { id: 'movie' as MediaType, label: 'Movies' },
  { id: 'tv' as MediaType, label: 'TV Series' }
];

const LANGUAGES = [
  { id: null, label: 'All Languages', flag: '🌐' },
  { id: 'ko', label: 'Korean (K-Drama)', flag: '🇰🇷' },
  { id: 'ja', label: 'Japanese (Anime)', flag: '🇯🇵' },
  { id: 'hi', label: 'Hindi (Bollywood)', flag: '🇮🇳' },
  { id: 'en', label: 'English (Hollywood)', flag: '🇺🇸' },
  { id: 'tr', label: 'Turkish Serials', flag: '🇹🇷' }
];

const selectedType = ref<MediaType>((route.query.type as MediaType) || 'movie');
const selectedLanguage = ref<string | null>((route.query.lang as string) || null);
const selectedGenreId = ref<number | null>(route.query.genre ? Number(route.query.genre) : null);
const selectedSort = ref<string>((route.query.sort as string) || 'popularity.desc');
const includeAdult = ref<boolean>(route.query.adult === 'true');
const showFiltersDrawer = ref(false);

const items = ref<MediaItem[]>([]);
const allGenres = ref<Genre[]>([]);
const page = ref(1);
const totalPages = ref(1);
const loading = ref(true);
const loadingMore = ref(false);

const hasMore = computed(() => page.value < totalPages.value);

const hasActiveFilters = computed(() => {
  return selectedLanguage.value !== null || selectedGenreId.value !== null || includeAdult.value;
});

const syncQueryParams = () => {
  const query: Record<string, any> = {};
  if (selectedType.value !== 'movie') query.type = selectedType.value;
  if (selectedLanguage.value) query.lang = selectedLanguage.value;
  if (selectedGenreId.value) query.genre = selectedGenreId.value;
  if (selectedSort.value !== 'popularity.desc') query.sort = selectedSort.value;
  if (includeAdult.value) query.adult = 'true';
  router.replace({ query });
};

const fetchMedia = async (reset = true) => {
  if (reset) {
    page.value = 1;
    items.value = [];
    loading.value = true;
  } else {
    loadingMore.value = true;
  }

  syncQueryParams();

  try {
    const res = await discoverMedia({
      type: selectedType.value,
      genreId: selectedGenreId.value,
      language: selectedLanguage.value,
      sortBy: selectedSort.value,
      page: page.value,
      includeAdult: includeAdult.value,
      adultOnly: includeAdult.value
    });

    totalPages.value = res.total_pages;
    if (reset) {
      items.value = res.results || [];
    } else {
      items.value.push(...(res.results || []));
    }
  } catch (err) {
    console.error('Error discovering media:', err);
    if (reset) items.value = [];
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadGenres = async () => {
  try {
    allGenres.value = await getGenres(selectedType.value);
  } catch (_) {}
};

const setMediaType = (type: MediaType) => {
  selectedType.value = type;
  loadGenres();
  fetchMedia(true);
};

const setLanguage = (lang: string | null) => {
  selectedLanguage.value = lang;
  fetchMedia(true);
};

const setGenre = (genreId: number | null) => {
  selectedGenreId.value = genreId;
  fetchMedia(true);
};

const applyPreset = (preset: typeof PRESETS[0]) => {
  if (preset.id === 'all') {
    resetFilters();
    return;
  }
  selectedType.value = preset.type || 'movie';
  selectedLanguage.value = preset.lang || null;
  selectedGenreId.value = preset.genre || null;
  includeAdult.value = preset.adult || false;
  loadGenres();
  fetchMedia(true);
};

const isPresetActive = (preset: typeof PRESETS[0]) => {
  if (preset.id === 'all') {
    return !selectedLanguage.value && !selectedGenreId.value && !includeAdult.value;
  }
  if (preset.lang && selectedLanguage.value !== preset.lang) return false;
  if (preset.genre && selectedGenreId.value !== preset.genre) return false;
  if (preset.adult && !includeAdult.value) return false;
  return true;
};

const resetFilters = () => {
  selectedLanguage.value = null;
  selectedGenreId.value = null;
  includeAdult.value = false;
  selectedSort.value = 'popularity.desc';
  showFiltersDrawer.value = false;
  fetchMedia(true);
};

const loadMore = () => {
  if (hasMore.value && !loadingMore.value) {
    page.value += 1;
    fetchMedia(false);
  }
};

onMounted(async () => {
  await loadGenres();
  fetchMedia(true);
});
</script>
