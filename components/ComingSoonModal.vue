<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="isOpen && item" 
        class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
        @click.self="emit('close')"
      >
        <!-- Modal Card Container -->
        <div class="relative w-full max-w-lg bg-marxi-950 rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col animate-scaleUp">
          
          <!-- Background Backdrop with Subtle Glow -->
          <div class="relative h-44 sm:h-52 w-full overflow-hidden bg-marxi-900">
            <img 
              v-if="item.backdrop_path || item.poster_path"
              :src="getImageUrl(item.backdrop_path || item.poster_path, 'original')" 
              :alt="item.title || item.name || 'Backdrop'"
              class="w-full h-full object-cover opacity-35 filter blur-xs scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-marxi-950 via-marxi-950/70 to-transparent"></div>

            <!-- Close Button Top Right -->
            <button 
              @click="emit('close')"
              class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-gray-300 hover:text-white border border-white/10 flex items-center justify-center transition-colors z-20"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Floating Poster & Title Lockup -->
            <div class="absolute bottom-3 left-4 right-4 flex items-end space-x-3.5 z-10">
              <div class="w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-xl shrink-0 bg-marxi-850">
                <img 
                  :src="getImageUrl(item.poster_path, 'w342')" 
                  :alt="item.title || item.name || 'Poster'"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="min-w-0 flex-1 pb-1">
                <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-[10px] uppercase tracking-wider shadow-md mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 fill-current" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                  </svg>
                  <span>Coming Soon • Not Released</span>
                </span>
                <h3 class="font-display font-black text-base sm:text-xl text-white truncate leading-snug">
                  {{ item.title || item.name }}
                </h3>
                <p class="text-xs text-amber-400 font-semibold mt-0.5 flex items-center space-x-1">
                  <span>🗓️ Expected:</span>
                  <span>{{ formatReleaseDate(item) }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Body Content Area -->
          <div class="p-4 sm:p-6 space-y-4">
            
            <!-- Clear Notification Box (Urdu + English) -->
            <div class="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-3">
              <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="space-y-1 text-left text-xs">
                <p class="font-bold text-white text-xs sm:text-sm">
                  Yeh title abhi release nahi hua (Not Yet Available)
                </p>
                <p class="text-gray-300 leading-relaxed text-[11px] sm:text-xs">
                  Streaming servers par yeh movie abhi available nahi hai. Jaise hi officially online release hogi, RHFlix par full HD streaming unlock ho jayegi.
                </p>
              </div>
            </div>

            <!-- Overview Snippet -->
            <p v-if="item.overview" class="text-xs text-gray-400 line-clamp-3 leading-relaxed">
              {{ item.overview }}
            </p>

            <!-- Action Buttons -->
            <div class="pt-2 space-y-2.5">
              <!-- Primary: Watch Trailer Button -->
              <button 
                @click="openTrailer"
                class="w-full py-3 px-4 bg-marxi-gold hover:bg-amber-400 text-black font-black text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all min-h-[44px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
                <span>Watch Official Trailer</span>
              </button>

              <div class="grid grid-cols-2 gap-2">
                <!-- Add to My Watchlist -->
                <button 
                  @click="handleToggleList"
                  class="py-2.5 px-3 bg-marxi-850 hover:bg-marxi-800 text-white font-bold text-xs rounded-xl border border-marxi-700 flex items-center justify-center space-x-1.5 transition-colors min-h-[42px]"
                >
                  <svg v-if="!inList" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-marxi-accent fill-current" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ inList ? 'In Watchlist' : 'Add to List' }}</span>
                </button>

                <!-- More Details Page Link -->
                <NuxtLink 
                  :to="detailsUrl"
                  @click="emit('close')"
                  class="py-2.5 px-3 bg-marxi-800 hover:bg-marxi-700 text-gray-200 hover:text-white font-bold text-xs rounded-xl border border-white/10 flex items-center justify-center space-x-1.5 transition-colors min-h-[42px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>View Details</span>
                </NuxtLink>
              </div>
            </div>

          </div>

        </div>
      </div>
    </transition>
  </Teleport>

  <!-- Nested Trailer Modal -->
  <TrailerModal 
    :isOpen="isTrailerOpen" 
    :videoKey="trailerKey" 
    :title="item?.title || item?.name" 
    @close="isTrailerOpen = false" 
  />
</template>

<script setup lang="ts">
import type { MediaItem, MovieDetails, TVDetails } from '~/types/tmdb';

const props = defineProps<{
  isOpen: boolean;
  item: MediaItem | MovieDetails | TVDetails | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { getImageUrl, getVideos } = useTmdb();
const { formatReleaseDate } = useMediaRelease();
const { isInList, toggleMyList } = useMyList();

const isTrailerOpen = ref(false);
const trailerKey = ref<string | null>(null);

const isMovie = computed(() => {
  if (!props.item) return true;
  return Boolean(props.item.title || props.item.media_type === 'movie');
});

const detailsUrl = computed(() => {
  if (!props.item) return '/';
  return isMovie.value ? `/movie/${props.item.id}` : `/tv/${props.item.id}`;
});

const inList = computed(() => {
  if (!props.item) return false;
  return isInList(props.item.id, isMovie.value ? 'movie' : 'tv');
});

const handleToggleList = () => {
  if (props.item) {
    toggleMyList(props.item);
  }
};

const openTrailer = async () => {
  if (!props.item) return;
  const mediaType = isMovie.value ? 'movie' : 'tv';
  try {
    const videos = await getVideos(mediaType, props.item.id);
    if (videos && videos.length > 0) {
      const trailer = videos.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.official)) || videos[0];
      trailerKey.value = trailer?.key || null;
    }
  } catch (_) {
    trailerKey.value = null;
  }
  isTrailerOpen.value = true;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen && !isTrailerOpen.value) {
    emit('close');
  }
};

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown);
  }
});
</script>

