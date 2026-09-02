<template>
  <div>
    <LoadingSkeleton v-if="loading" type="detail" />
    <ErrorState v-else-if="error" title="Movie Details Unavailable" :message="error" :retry="loadData" />

    <div v-else-if="movie" class="relative space-y-12">
      
      <!-- Backdrop Banner -->
      <div class="relative w-full h-[45vh] sm:h-[55vh] min-h-[350px] overflow-hidden bg-marxi-950">
        <img 
          :src="getImageUrl(movie.backdrop_path || movie.poster_path, 'original')" 
          :alt="movie.title" 
          class="w-full h-full object-cover object-center scale-105 filter blur-xs"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-marxi-900 via-marxi-950/80 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-marxi-900 via-marxi-900/80 to-transparent"></div>
      </div>

      <!-- Main Info Container -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-36 sm:-mt-64 z-10 space-y-10 sm:space-y-12 pb-16">
        <div class="flex flex-col md:flex-row gap-6 sm:gap-8 items-start">
          
          <!-- Left: Movie Poster -->
          <div class="w-40 sm:w-64 lg:w-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-marxi-700/60 bg-marxi-850 shrink-0 mx-auto md:mx-0">
            <img 
              :src="getImageUrl(movie.poster_path, 'w500')" 
              :alt="movie.title" 
              class="w-full h-auto object-cover"
            />
          </div>

          <!-- Right: Detailed Info -->
          <div class="flex-1 space-y-4 sm:space-y-5 text-center md:text-left">
            
            <!-- Category & Badges -->
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-2.5 text-xs font-semibold">
              <span class="px-2.5 py-1 bg-marxi-accent text-white font-bold rounded-lg uppercase tracking-wider text-[10px]">
                Movie
              </span>

              <div v-if="movie.vote_average" class="flex items-center space-x-1 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-marxi-gold border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-white font-bold">{{ movie.vote_average.toFixed(1) }}</span>
                <span v-if="movie.vote_count" class="text-gray-400 font-normal">({{ movie.vote_count }} votes)</span>
              </div>

              <span v-if="movie.release_date" class="px-2.5 py-1 bg-marxi-800 rounded-lg text-gray-300 border border-marxi-700">
                {{ movie.release_date }}
              </span>

              <span v-if="movie.runtime" class="px-2.5 py-1 bg-marxi-800 rounded-lg text-gray-300 border border-marxi-700">
                {{ formattedRuntime }}
              </span>
            </div>

            <!-- Title & Tagline -->
            <div class="space-y-1">
              <h1 class="text-2xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight">
                {{ movie.title }}
              </h1>
              <p v-if="movie.tagline" class="text-marxi-accent font-medium italic text-xs sm:text-base">
                "{{ movie.tagline }}"
              </p>
            </div>

            <!-- Genres Pills -->
            <div v-if="movie.genres && movie.genres.length > 0" class="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
              <span 
                v-for="genre in movie.genres" 
                :key="genre.id"
                class="px-2.5 py-1 bg-marxi-850 text-xs font-semibold text-gray-300 rounded-full border border-marxi-700"
              >
                {{ genre.name }}
              </span>
            </div>

            <!-- Action Buttons (Min 44px Touch Target) -->
            <div class="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
              <NuxtLink 
                :to="`/watch/movie/${movie.id}`"
                class="px-6 py-3 sm:px-8 sm:py-3.5 bg-marxi-accent hover:bg-marxi-accentHover text-white font-bold rounded-xl flex items-center space-x-2.5 shadow-glow-red hover:scale-105 transition-all duration-200 min-h-[44px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 fill-current" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
                <span>Watch Movie</span>
              </NuxtLink>

              <button 
                @click="toggleMyList(movie)"
                class="px-5 py-3 sm:px-6 sm:py-3.5 bg-marxi-850 hover:bg-marxi-800 text-white font-semibold rounded-xl flex items-center space-x-2 border border-marxi-700 transition-colors min-h-[44px]"
              >
                <svg v-if="!inList" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-marxi-accent fill-current" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span>{{ inList ? 'In My List' : 'Add to My List' }}</span>
              </button>
            </div>

            <!-- Overview -->
            <div class="space-y-1.5 pt-2 border-t border-marxi-800/80 text-left">
              <h3 class="text-white font-bold text-sm sm:text-base">Story Overview</h3>
              <p class="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                {{ movie.overview || 'No description available for this title.' }}
              </p>
            </div>

            <!-- Additional Details Matrix -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-3 border-t border-marxi-800/80 text-xs text-left">
              <div v-if="directorName">
                <span class="text-gray-400 block">Director</span>
                <span class="text-white font-semibold">{{ directorName }}</span>
              </div>
              <div>
                <span class="text-gray-400 block">Original Language</span>
                <span class="text-white font-semibold uppercase">{{ movie.original_language || 'EN' }}</span>
              </div>
              <div>
                <span class="text-gray-400 block">Popularity Score</span>
                <span class="text-white font-semibold">{{ movie.popularity ? movie.popularity.toFixed(0) : 'N/A' }}</span>
              </div>
              <div>
                <span class="text-gray-400 block">Status</span>
                <span class="text-white font-semibold">{{ movie.status || 'Released' }}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Top Cast Section (Grid UI) -->
        <div v-if="topCast.length > 0" class="space-y-4 pt-6 border-t border-marxi-800">
          <div class="flex items-center space-x-3">
            <div class="w-1.5 h-6 bg-marxi-accent rounded-full"></div>
            <h2 class="font-display text-lg sm:text-2xl font-bold text-white tracking-tight">
              Top Cast & Starring
            </h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div 
              v-for="actor in topCast" 
              :key="actor.id"
              class="group relative bg-marxi-850 hover:bg-marxi-800 p-2.5 sm:p-3 rounded-2xl border border-marxi-800 hover:border-marxi-700 transition-all duration-300 flex items-center space-x-3"
            >
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-marxi-800 shrink-0 border border-marxi-700 shadow-md group-hover:scale-105 transition-transform">
                <img 
                  v-if="actor.profile_path"
                  :src="getImageUrl(actor.profile_path, 'w185')" 
                  :alt="actor.name"
                  class="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div v-else class="w-full h-full bg-gradient-to-tr from-marxi-800 to-marxi-700 flex items-center justify-center font-bold text-xs text-marxi-accent tracking-wider">
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

        <!-- Similar Movies (Grid Layout) -->
        <ContentRow 
          v-if="similarMovies.length > 0"
          title="More Like This"
          :items="similarMovies"
          layout="grid"
        />

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MovieDetails, CastMember, CrewMember, MediaItem } from '~/types/tmdb';

definePageMeta({
  key: route => route.fullPath
});

const route = useRoute();
const movieId = computed(() => route.params.id as string);

const { getMovieDetails, getCredits, getSimilar, getImageUrl } = useTmdb();
const { isInList, toggleMyList } = useMyList();

const movie = ref<MovieDetails | null>(null);
const topCast = ref<CastMember[]>([]);
const directorName = ref<string | null>(null);
const similarMovies = ref<MediaItem[]>([]);

const loading = ref(true);
const error = ref<string | null>(null);

const inList = computed(() => movie.value ? isInList(movie.value.id, 'movie') : false);

const formattedRuntime = computed(() => {
  if (!movie.value?.runtime) return '';
  const hrs = Math.floor(movie.value.runtime / 60);
  const mins = movie.value.runtime % 60;
  return `${hrs}h ${mins}m`;
});

const getInitials = (name: string) => {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const loadData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [movieData, creditsData, similarData] = await Promise.all([
      getMovieDetails(movieId.value),
      getCredits('movie', movieId.value).catch(() => ({ cast: [], crew: [] })),
      getSimilar('movie', movieId.value).catch(() => ({ results: [] }))
    ]);

    movie.value = movieData;
    if (movie.value) {
      useSeoMeta({
        title: `${movie.value.title} (${movie.value.release_date?.substring(0, 4) || ''}) - Stream on RHFlix`,
        ogTitle: `${movie.value.title} - Stream on RHFlix`,
        description: movie.value.overview,
        ogDescription: movie.value.overview,
        ogImage: movie.value.backdrop_path ? getImageUrl(movie.value.backdrop_path, 'w500') : undefined
      });

      useHead({
        link: [
          { rel: 'canonical', href: `https://reflix.rehmanwebs.com/movie/${movie.value.id}` }
        ],
        script: [
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Movie',
              'name': movie.value.title,
              'image': movie.value.poster_path ? getImageUrl(movie.value.poster_path, 'w500') : undefined,
              'description': movie.value.overview,
              'datePublished': movie.value.release_date,
              'aggregateRating': movie.value.vote_average ? {
                '@type': 'AggregateRating',
                'ratingValue': movie.value.vote_average,
                'bestRating': 10,
                'ratingCount': movie.value.vote_count || 100
              } : undefined
            })
          }
        ]
      });
    }

    if (creditsData) {
      topCast.value = (creditsData.cast || []).slice(0, 12);
      const dir = (creditsData.crew || []).find((c: CrewMember) => c.job === 'Director');
      directorName.value = dir ? dir.name : null;
    }

    if (similarData && similarData.results) {
      similarMovies.value = similarData.results.map(item => ({
        ...item,
        media_type: 'movie'
      }));
    }

  } catch (err: any) {
    error.value = err?.message || 'Failed to fetch movie details from TMDB.';
  } finally {
    loading.value = false;
  }
};

watch(() => movieId.value, () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  loadData();
});

onMounted(() => {
  loadData();
});
</script>
