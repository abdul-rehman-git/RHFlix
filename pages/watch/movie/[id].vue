<template>
  <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-8">
    
    <!-- Top Action Bar -->
    <div class="flex items-center justify-between">
      <NuxtLink 
        :to="`/movie/${movieId}`" 
        class="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-marxi-850/90 hover:bg-marxi-800 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-marxi-700/80 transition-colors min-h-[40px] sm:min-h-[44px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Movie</span>
      </NuxtLink>

      <div class="flex items-center space-x-2 text-xs font-semibold text-gray-400">
        <span class="px-2.5 py-1 bg-marxi-accent text-white rounded-md uppercase font-bold text-[9px] sm:text-[10px] tracking-wider shadow-glow-red">
          Now Playing
        </span>
      </div>
    </div>

    <!-- Playback Player Section (Flush Edge-to-Edge on Mobile) -->
    <div class="-mx-3 sm:mx-0">
      <PlaybackPlayer 
        mediaType="movie" 
        :tmdbId="movieId" 
        :title="movie?.title"
      />
    </div>

    <!-- Metadata Below Player -->
    <div v-if="movie" class="bg-marxi-850 rounded-2xl p-4 sm:p-6 border border-marxi-800/80 space-y-3 sm:space-y-4 shadow-xl">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-marxi-800/80 pb-3.5">
        <div>
          <div class="flex items-center space-x-2 text-[11px] sm:text-xs font-semibold text-gray-400 mb-1">
            <span class="px-1.5 py-0.5 bg-marxi-700/60 rounded text-gray-300 font-bold uppercase text-[9px]">
              Movie
            </span>
            <span v-if="movie.release_date">• {{ movie.release_date.substring(0, 4) }}</span>
            <span v-if="movie.vote_average" class="text-marxi-gold flex items-center">
              ★ {{ movie.vote_average.toFixed(1) }}
            </span>
          </div>
          <h1 class="text-lg sm:text-3xl font-display font-black text-white tracking-tight">
            {{ movie.title }}
          </h1>
        </div>

        <button 
          @click="toggleMyList(movie)"
          class="px-4 py-2.5 bg-marxi-800 hover:bg-marxi-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 border border-white/10 transition-colors shrink-0 min-h-[44px]"
        >
          <svg v-if="!inList" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-marxi-accent fill-current" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>{{ inList ? 'Saved in My List' : 'Add to My List' }}</span>
        </button>
      </div>

      <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">
        {{ movie.overview || 'Streaming movie playback on Marxi OTT.' }}
      </p>
    </div>

    <!-- Top Cast Section (Grid UI) -->
    <div v-if="topCast.length > 0" class="space-y-3 sm:space-y-4 pt-2 sm:pt-4 border-t border-marxi-800/80">
      <div class="flex items-center space-x-2.5">
        <div class="w-1.5 h-5 sm:h-6 bg-marxi-accent rounded-full"></div>
        <h3 class="font-display text-base sm:text-xl font-bold text-white tracking-tight">
          Top Cast & Starring
        </h3>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <div 
          v-for="actor in topCast" 
          :key="actor.id"
          class="group relative bg-marxi-850 hover:bg-marxi-800 p-2 sm:p-3 rounded-2xl border border-marxi-800/80 hover:border-marxi-700 transition-all duration-300 flex items-center space-x-2.5"
        >
          <div class="w-9 h-9 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-marxi-800 shrink-0 border border-marxi-700 shadow-md group-hover:scale-105 transition-transform">
            <img 
              v-if="actor.profile_path"
              :src="getImageUrl(actor.profile_path, 'w185')" 
              :alt="actor.name"
              class="w-full h-full object-cover object-top"
              loading="lazy"
            />
            <div v-else class="w-full h-full bg-gradient-to-tr from-marxi-800 to-marxi-700 flex items-center justify-center font-bold text-[10px] text-marxi-accent tracking-wider">
              {{ getInitials(actor.name) }}
            </div>
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold text-white group-hover:text-marxi-accent truncate transition-colors">
              {{ actor.name }}
            </h4>
            <p class="text-[10px] sm:text-[11px] text-gray-400 truncate mt-0.5 font-medium">
              {{ actor.character || 'Cast' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Similar Movies Row (Grid Layout) -->
    <ContentRow 
      v-if="similarMovies.length > 0"
      title="More Movies Like This"
      :items="similarMovies"
      layout="grid"
    />

  </div>
</template>

<script setup lang="ts">
import type { MovieDetails, CastMember, MediaItem } from '~/types/tmdb';

definePageMeta({
  key: route => route.fullPath
});

const route = useRoute();
const movieId = computed(() => route.params.id as string);

const { getMovieDetails, getCredits, getSimilar, getImageUrl } = useTmdb();
const { addWatchHistory } = useWatchHistory();
const { isInList, toggleMyList } = useMyList();

const movie = ref<MovieDetails | null>(null);
const topCast = ref<CastMember[]>([]);
const similarMovies = ref<MediaItem[]>([]);

const inList = computed(() => movie.value ? isInList(movie.value.id, 'movie') : false);

const getInitials = (name: string) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const loadWatchData = async () => {
  try {
    const [movieData, creditsData, similarData] = await Promise.all([
      getMovieDetails(movieId.value),
      getCredits('movie', movieId.value).catch(() => ({ cast: [], crew: [] })),
      getSimilar('movie', movieId.value).catch(() => ({ results: [] }))
    ]);

    movie.value = movieData;
    if (movie.value) {
      useSeoMeta({
        title: `Watching ${movie.value.title} - RHFlix`,
        ogTitle: `Watching ${movie.value.title} - RHFlix`,
        description: movie.value.overview,
        ogDescription: movie.value.overview,
        ogImage: movie.value.backdrop_path ? getImageUrl(movie.value.backdrop_path, 'w500') : undefined
      });

      useHead({
        link: [
          { rel: 'canonical', href: `https://reflix.rehmanwebs.com/watch/movie/${movie.value.id}` }
        ]
      });

      addWatchHistory({
        tmdbId: movie.value.id,
        type: 'movie',
        title: movie.value.title,
        posterPath: movie.value.poster_path,
        backdropPath: movie.value.backdrop_path
      });
    }

    if (creditsData) {
      topCast.value = (creditsData.cast || []).slice(0, 12);
    }

    if (similarData && similarData.results) {
      similarMovies.value = similarData.results.map(item => ({
        ...item,
        media_type: 'movie'
      }));
    }
  } catch (err) {
    console.error('Error fetching movie details for watch page:', err);
  }
};

watch(() => movieId.value, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  loadWatchData();
});

onMounted(() => {
  loadWatchData();
});
</script>
