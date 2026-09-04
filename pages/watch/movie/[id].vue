<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6 sm:space-y-10">
    
    <!-- Top Bar Navigation -->
    <div class="flex items-center justify-between">
      <NuxtLink 
        :to="`/movie/${movieId}`" 
        class="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-marxi-850 hover:bg-marxi-800 px-3.5 py-2.5 rounded-xl border border-marxi-800 transition-all shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Movie Details</span>
      </NuxtLink>

      <div class="flex items-center space-x-2">
        <span class="px-2.5 py-1 bg-marxi-accent text-white rounded-lg uppercase font-bold text-[10px] tracking-wider shadow-glow-red">
          Now Watching
        </span>
      </div>
    </div>

    <!-- Main Player Container -->
    <div class="-mx-3 sm:mx-0">
      <PlaybackPlayer 
        mediaType="movie" 
        :tmdbId="movieId" 
        :title="movie?.title"
        :posterPath="movie?.poster_path"
        :backdropPath="movie?.backdrop_path"
      />
    </div>

    <!-- Movie Details & Metadata Card -->
    <div v-if="movie" class="bg-marxi-850 rounded-2xl p-4 sm:p-7 border border-marxi-800 space-y-4 shadow-xl">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-marxi-800 pb-5">
        <div class="space-y-1.5">
          <div class="flex items-center flex-wrap gap-2 text-xs font-semibold text-gray-400">
            <span class="px-2 py-0.5 bg-marxi-800 rounded text-marxi-gold font-bold uppercase text-[10px]">
              Movie
            </span>
            <span v-if="movie.release_date">• {{ movie.release_date.substring(0, 4) }}</span>
            <span v-if="movie.runtime">• {{ movie.runtime }} mins</span>
            <span v-if="movie.vote_average" class="text-marxi-gold flex items-center font-bold">
              ★ {{ movie.vote_average.toFixed(1) }}
            </span>
          </div>
          <h1 class="text-xl sm:text-3xl font-display font-black text-white tracking-tight">
            {{ movie.title }}
          </h1>
          <p v-if="movie.tagline" class="text-xs sm:text-sm text-gray-400 italic">
            "{{ movie.tagline }}"
          </p>
        </div>

        <!-- My List Action Button -->
        <button 
          @click="toggleMyList(movie)"
          class="px-5 py-2.5 bg-marxi-800 hover:bg-marxi-700 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 border border-white/10 transition-all shrink-0 min-h-[44px]"
        >
          <svg v-if="!inList" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-marxi-accent fill-current" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>{{ inList ? 'In My List' : 'Add to My List' }}</span>
        </button>
      </div>

      <!-- Genres & Overview -->
      <div class="space-y-3">
        <div v-if="movie.genres && movie.genres.length > 0" class="flex flex-wrap gap-1.5">
          <span 
            v-for="genre in movie.genres" 
            :key="genre.id" 
            class="px-2.5 py-1 rounded-lg bg-marxi-800 text-gray-300 text-xs font-medium border border-white/5"
          >
            {{ genre.name }}
          </span>
        </div>
        <p class="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-4xl">
          {{ movie.overview }}
        </p>
      </div>
    </div>

    <!-- Similar Movies Row -->
    <ContentRow 
      v-if="similarMovies.length > 0"
      title="You May Also Like" 
      :items="similarMovies" 
      :loading="loadingSimilar"
    />

  </div>
</template>

<script setup lang="ts">
import { useTmdb } from '~/composables/useTmdb';
import { useMyList } from '~/composables/useMyList';
import type { MovieDetails, MediaItem } from '~/types/tmdb';

const route = useRoute();
const movieId = computed(() => route.params.id as string);

const { getMovieDetails, getSimilar } = useTmdb();
const { isInList, toggleMyList } = useMyList();

const movie = ref<MovieDetails | null>(null);
const similarMovies = ref<MediaItem[]>([]);
const loadingSimilar = ref(true);

const inList = computed(() => {
  if (!movie.value) return false;
  return isInList(movie.value.id, 'movie');
});

const loadData = async () => {
  if (!movieId.value) return;
  try {
    movie.value = await getMovieDetails(movieId.value);
    
    // Fetch similar movies
    const simRes = await getSimilar('movie', movieId.value);
    similarMovies.value = simRes.results || [];
  } catch (err) {
    console.error('Failed to load movie details:', err);
  } finally {
    loadingSimilar.value = false;
  }
};

onMounted(() => {
  loadData();
});

watch(() => movieId.value, () => {
  loadData();
});

useHead({
  title: computed(() => movie.value ? `Watch ${movie.value.title} - RHFlix` : 'Watch Movie - RHFlix')
});
</script>
