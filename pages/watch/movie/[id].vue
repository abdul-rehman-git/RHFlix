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
        <span 
          v-if="isUnreleased"
          class="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-lg uppercase font-black text-[10px] tracking-wider shadow-md"
        >
          Coming Soon
        </span>
        <span 
          v-else
          class="px-2.5 py-1 bg-marxi-accent text-white rounded-lg uppercase font-bold text-[10px] tracking-wider shadow-glow-red"
        >
          Now Watching
        </span>
      </div>
    </div>

    <!-- Main Player or Unreleased Trailer/Notice Container -->
    <div class="-mx-3 sm:mx-0">
      <!-- Loading State: NEVER Mount PlaybackPlayer while fetching movie status -->
      <div 
        v-if="loadingMovie" 
        class="relative w-full aspect-video bg-marxi-950 rounded-none sm:rounded-2xl overflow-hidden border border-marxi-800 flex flex-col items-center justify-center p-6 text-center space-y-3"
      >
        <div class="w-10 h-10 border-3 border-marxi-accent/30 border-t-marxi-accent rounded-full animate-spin"></div>
        <p class="text-xs text-gray-400 font-semibold">Verifying movie release status...</p>
      </div>

      <!-- Unreleased Title: Trailer Player & Notice (PlaybackPlayer is NOT mounted) -->
      <div v-else-if="isUnreleased" class="space-y-4">
        <!-- Trailer Embed (if available) -->
        <div v-if="trailerKey" class="relative w-full aspect-video bg-black rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border border-amber-500/40">
          <iframe 
            :src="`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0`"
            class="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>

        <!-- No Trailer: Aesthetic Notice Card with Backdrop -->
        <div 
          v-else 
          class="relative w-full aspect-video bg-marxi-950 rounded-none sm:rounded-2xl overflow-hidden border border-amber-500/30 flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-2xl"
        >
          <img 
            v-if="movie?.backdrop_path" 
            :src="getImageUrl(movie.backdrop_path, 'original')" 
            :alt="movie.title"
            class="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm"
          />
          <div class="relative z-10 w-16 h-16 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="relative z-10 max-w-md space-y-2">
            <h2 class="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
              This Movie Has Not Released Yet
            </h2>
            <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Scheduled release date: <strong class="text-amber-400">{{ formattedReleaseDate(movie) }}</strong>. Streaming playback will unlock once the title officially premieres.
            </p>
          </div>
        </div>

        <!-- Explanatory Banner -->
        <div class="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
          <div class="flex items-center space-x-2.5">
            <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0"></span>
            <span>
              <template v-if="trailerKey">🎬 Playing the <strong>Official Trailer</strong>. </template>Full movie streaming will be available on release (<strong>{{ formattedReleaseDate(movie) }}</strong>).
            </span>
          </div>
          <NuxtLink 
            :to="`/movie/${movieId}`" 
            class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg text-xs transition-colors shrink-0 text-center"
          >
            View Movie Details
          </NuxtLink>
        </div>
      </div>

      <!-- Released Title: Standard Streaming Multi-Server Player -->
      <PlaybackPlayer 
        v-else-if="movie"
        mediaType="movie" 
        :tmdbId="movieId" 
        :title="movie.title" 
        :posterPath="movie.poster_path" 
        :backdropPath="movie.backdrop_path" 
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

const { getMovieDetails, getSimilar, getVideos, getImageUrl } = useTmdb();
const { isInList, toggleMyList } = useMyList();
const { isComingSoon, formatReleaseDate } = useMediaRelease();

const movie = ref<MovieDetails | null>(null);
const loadingMovie = ref(true);
const isUnreleased = computed(() => isComingSoon(movie.value));
const trailerKey = ref<string | null>(null);
const similarMovies = ref<MediaItem[]>([]);
const loadingSimilar = ref(true);

const inList = computed(() => {
  if (!movie.value) return false;
  return isInList(movie.value.id, 'movie');
});

const loadData = async () => {
  if (!movieId.value) return;
  loadingMovie.value = true;
  try {
    const [movieData, simRes, videosData] = await Promise.all([
      getMovieDetails(movieId.value),
      getSimilar('movie', movieId.value).catch(() => ({ results: [] })),
      getVideos('movie', movieId.value).catch(() => [])
    ]);

    movie.value = movieData;
    similarMovies.value = simRes.results || [];

    if (videosData && videosData.length > 0) {
      const trailer = videosData.find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.official)) || videosData[0];
      if (trailer && trailer.key) {
        trailerKey.value = trailer.key;
      }
    }
  } catch (err) {
    console.error('Failed to load movie details:', err);
  } finally {
    loadingSimilar.value = false;
    loadingMovie.value = false;
  }
};

onMounted(() => {
  loadData();
});

watch(() => movieId.value, () => {
  loadData();
});

watch(movie, (newMovie) => {
  if (newMovie) {
    useSeoMeta({
      title: `Watch ${newMovie.title} Online - RHFlix`,
      ogTitle: `Watch ${newMovie.title} Online - RHFlix`,
      description: newMovie.overview,
      ogDescription: newMovie.overview,
      ogUrl: `https://rhflix.rehmanwebs.com/watch/movie/${newMovie.id}`
    });

    useHead({
      link: [
        { rel: 'canonical', href: `https://rhflix.rehmanwebs.com/watch/movie/${newMovie.id}` }
      ]
    });
  }
}, { immediate: true });

useHead({
  title: computed(() => movie.value ? `Watch ${movie.value.title} - RHFlix` : 'Watch Movie - RHFlix')
});
</script>
