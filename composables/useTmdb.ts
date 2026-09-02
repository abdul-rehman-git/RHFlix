import type { 
  MediaItem, 
  MovieDetails, 
  TVDetails, 
  SeasonDetails, 
  TMDBPaginatedResponse, 
  Genre,
  MediaType,
  CreditsResponse
} from '~/types/tmdb';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// SVG Placeholder Data URI for missing posters / stills
const SVG_PLACEHOLDER = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450" fill="%2313151f"%3E%3Crect width="100%25" height="100%25" fill="%2313151f"/%3E%3Cpath d="M120 180h60v90h-60z" fill="%23232738"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%236b7280"%3ERHFlix Stream%3C/text%3E%3C/svg%3E';

// Mock Data for offline / fallback mode when API key is missing
const MOCK_MOVIES: MediaItem[] = [
  {
    id: 550,
    title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/hZkgoQY85WAgW2s5FiBGfiG3Mws.jpg',
    media_type: 'movie',
    popularity: 92.5,
    release_date: '1999-10-15',
    vote_average: 8.4,
    vote_count: 28000,
    genre_ids: [18]
  },
  {
    id: 157336,
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/xJHokMbljvjADYdit5fK5VQsX2k.jpg',
    media_type: 'movie',
    popularity: 140.2,
    release_date: '2014-11-05',
    vote_average: 8.4,
    vote_count: 34000,
    genre_ids: [12, 18, 878]
  },
  {
    id: 27205,
    title: 'Inception',
    overview: 'Cobb, a skilled thief who steals corporate secrets through dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster_path: '/oYu2T8CrmDhM8PhbK3LUBnmxI7d.jpg',
    backdrop_path: '/8ZTVqvKDQ8emSGUEMjsS4yHAu4C.jpg',
    media_type: 'movie',
    popularity: 110.8,
    release_date: '2010-07-15',
    vote_average: 8.4,
    vote_count: 36000,
    genre_ids: [28, 878, 12]
  },
  {
    id: 1078605,
    title: 'Fallback Feature Movie',
    overview: 'An exciting action adventure movie ready to test streaming playback.',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/hZkgoQY85WAgW2s5FiBGfiG3Mws.jpg',
    media_type: 'movie',
    popularity: 88.0,
    release_date: '2024-01-01',
    vote_average: 8.1,
    vote_count: 1200,
    genre_ids: [28, 53]
  }
];

const MOCK_TV_SHOWS: MediaItem[] = [
  {
    id: 1399,
    name: 'Game of Thrones',
    overview: 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war.',
    poster_path: '/1XS1oqL89opfnbLl8WnZY1j1uJx.jpg',
    backdrop_path: '/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
    media_type: 'tv',
    popularity: 250.5,
    first_air_date: '2011-04-17',
    vote_average: 8.4,
    vote_count: 22000,
    genre_ids: [10765, 18, 10759]
  },
  {
    id: 60625,
    name: 'Rick and Morty',
    overview: 'An intelligent, alcohol-addicted scientist named Rick travels through time and space with his anxious 14-year-old grandson Morty.',
    poster_path: '/gd1W0dyaVGe2flaxLDFvPHpBxTJ.jpg',
    backdrop_path: '/m7tG5E1ESuL9Z8T593E9V2Z.jpg',
    media_type: 'tv',
    popularity: 180.2,
    first_air_date: '2013-12-02',
    vote_average: 8.7,
    vote_count: 9500,
    genre_ids: [16, 35, 10765]
  },
  {
    id: 1396,
    name: 'Breaking Bad',
    overview: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student.',
    poster_path: '/ztkUQFLlC1WCC5U95t9x9fAo199.jpg',
    backdrop_path: '/tsRy63MuZvKCZC28evTV8pViXyU.jpg',
    media_type: 'tv',
    popularity: 210.0,
    first_air_date: '2008-01-20',
    vote_average: 8.9,
    vote_count: 13500,
    genre_ids: [18, 80]
  }
];

export const useTmdb = () => {
  const config = useRuntimeConfig();
  const apiKey = config.public.tmdbApiKey as string;

  const isConfigured = computed(() => {
    return Boolean(apiKey && apiKey.trim().length > 0 && apiKey !== 'YOUR_TMDB_API_KEY');
  });

  const getImageUrl = (path: string | null | undefined, size: 'original' | 'w500' | 'w342' | 'w185' = 'w500'): string => {
    if (!path || typeof path !== 'string' || path.trim().length === 0) {
      return SVG_PLACEHOLDER;
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
  };

  const fetchFromTmdb = async <T>(endpoint: string, params: Record<string, any> = {}): Promise<T> => {
    if (!isConfigured.value) {
      throw new Error('TMDB API Key is missing. Please set NUXT_PUBLIC_TMDB_API_KEY in your .env file.');
    }

    const query = new URLSearchParams({
      api_key: apiKey,
      ...params
    });

    const url = `${TMDB_BASE_URL}${endpoint}?${query.toString()}`;

    try {
      const data = await $fetch<T>(url);
      return data;
    } catch (err: any) {
      console.error(`[TMDB API Error] ${endpoint}:`, err);
      throw err;
    }
  };

  // Trending Movies / TV
  const getTrending = async (type: MediaType = 'movie', page = 1): Promise<TMDBPaginatedResponse<MediaItem>> => {
    if (!isConfigured.value) {
      const items = type === 'movie' ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
    try {
      return await fetchFromTmdb<TMDBPaginatedResponse<MediaItem>>(`/trending/${type}/day`, { page });
    } catch (err) {
      const items = type === 'movie' ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
  };

  // Popular Movies / TV
  const getPopular = async (type: MediaType = 'movie', page = 1): Promise<TMDBPaginatedResponse<MediaItem>> => {
    if (!isConfigured.value) {
      const items = type === 'movie' ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
    try {
      return await fetchFromTmdb<TMDBPaginatedResponse<MediaItem>>(`/${type}/popular`, { page });
    } catch (err) {
      const items = type === 'movie' ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
  };

  // Top Rated
  const getTopRated = async (type: MediaType = 'movie', page = 1): Promise<TMDBPaginatedResponse<MediaItem>> => {
    if (!isConfigured.value) {
      const items = type === 'movie' ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
    try {
      return await fetchFromTmdb<TMDBPaginatedResponse<MediaItem>>(`/${type}/top_rated`, { page });
    } catch (err) {
      const items = type === 'movie' ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
  };

  // Now Playing Movies
  const getNowPlaying = async (page = 1): Promise<TMDBPaginatedResponse<MediaItem>> => {
    if (!isConfigured.value) {
      return { page: 1, results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
    }
    try {
      return await fetchFromTmdb<TMDBPaginatedResponse<MediaItem>>('/movie/now_playing', { page });
    } catch (err) {
      return { page: 1, results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
    }
  };

  // Airing Today TV
  const getAiringToday = async (page = 1): Promise<TMDBPaginatedResponse<MediaItem>> => {
    if (!isConfigured.value) {
      return { page: 1, results: MOCK_TV_SHOWS, total_pages: 1, total_results: MOCK_TV_SHOWS.length };
    }
    try {
      return await fetchFromTmdb<TMDBPaginatedResponse<MediaItem>>('/tv/airing_today', { page });
    } catch (err) {
      return { page: 1, results: MOCK_TV_SHOWS, total_pages: 1, total_results: MOCK_TV_SHOWS.length };
    }
  };

  // Get Genres
  const getGenres = async (type: MediaType = 'movie'): Promise<Genre[]> => {
    if (!isConfigured.value) {
      return [
        { id: 28, name: 'Action' },
        { id: 18, name: 'Drama' },
        { id: 878, name: 'Sci-Fi' },
        { id: 35, name: 'Comedy' }
      ];
    }
    try {
      const res = await fetchFromTmdb<{ genres: Genre[] }>(`/genre/${type}/list`);
      return res.genres || [];
    } catch (err) {
      return [
        { id: 28, name: 'Action' },
        { id: 18, name: 'Drama' },
        { id: 878, name: 'Sci-Fi' },
        { id: 35, name: 'Comedy' }
      ];
    }
  };

  // Get Items by Genre
  const getByGenre = async (type: MediaType, genreId: number, page = 1): Promise<TMDBPaginatedResponse<MediaItem>> => {
    if (!isConfigured.value) {
      const items = type === 'movie' ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
    try {
      return await fetchFromTmdb<TMDBPaginatedResponse<MediaItem>>(`/discover/${type}`, { 
        with_genres: genreId.toString(),
        page 
      });
    } catch (err) {
      const items = type === 'movie' ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
  };

  // Movie Details
  const getMovieDetails = async (id: number | string): Promise<MovieDetails> => {
    if (!isConfigured.value) {
      const found = MOCK_MOVIES.find(m => m.id === Number(id)) || MOCK_MOVIES[0];
      return {
        ...found,
        runtime: 148,
        status: 'Released',
        tagline: 'Mind-bending cinematic experience.',
        budget: 160000000,
        revenue: 836800000,
        original_language: 'en',
        genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }]
      };
    }
    return fetchFromTmdb<MovieDetails>(`/movie/${id}`);
  };

  // TV Details
  const getTVDetails = async (id: number | string): Promise<TVDetails> => {
    if (!isConfigured.value) {
      const found = MOCK_TV_SHOWS.find(t => t.id === Number(id)) || MOCK_TV_SHOWS[0];
      return {
        ...found,
        number_of_seasons: 8,
        number_of_episodes: 73,
        status: 'Ended',
        tagline: 'Winter is Coming.',
        original_language: 'en',
        genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 18, name: 'Drama' }],
        seasons: [
          { id: 3624, season_number: 1, name: 'Season 1', episode_count: 10, poster_path: found.poster_path },
          { id: 3625, season_number: 2, name: 'Season 2', episode_count: 10, poster_path: found.poster_path }
        ]
      };
    }
    return fetchFromTmdb<TVDetails>(`/tv/${id}`);
  };

  // Season Details
  const getSeasonDetails = async (tvId: number | string, seasonNumber: number): Promise<SeasonDetails> => {
    if (!isConfigured.value) {
      return {
        id: 3624,
        season_number: seasonNumber,
        name: `Season ${seasonNumber}`,
        poster_path: MOCK_TV_SHOWS[0].poster_path,
        episodes: [
          {
            id: 63056,
            name: 'Winter Is Coming',
            overview: 'Lord Robert Baratheon and his queen, Cersei Lannister, travel north to Winterfell.',
            episode_number: 1,
            season_number: seasonNumber,
            still_path: MOCK_TV_SHOWS[0].backdrop_path,
            air_date: '2011-04-17',
            vote_average: 8.8,
            vote_count: 1200
          },
          {
            id: 63057,
            name: 'The Kingsroad',
            overview: 'An injured Bran learns of his fate; Ned leaves for King\'s Landing with daughters Sansa and Arya.',
            episode_number: 2,
            season_number: seasonNumber,
            still_path: MOCK_TV_SHOWS[0].backdrop_path,
            air_date: '2011-04-24',
            vote_average: 8.6,
            vote_count: 1100
          }
        ]
      };
    }
    return fetchFromTmdb<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
  };

  // Global Search
  const search = async (query: string, type: 'multi' | 'movie' | 'tv' = 'multi', page = 1): Promise<TMDBPaginatedResponse<MediaItem>> => {
    if (!query.trim()) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }

    if (!isConfigured.value) {
      const q = query.toLowerCase();
      const all = [...MOCK_MOVIES, ...MOCK_TV_SHOWS];
      const filtered = all.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) || 
        (item.name && item.name.toLowerCase().includes(q))
      );
      return { page: 1, results: filtered, total_pages: 1, total_results: filtered.length };
    }

    try {
      return await fetchFromTmdb<TMDBPaginatedResponse<MediaItem>>(`/search/${type}`, { query, page });
    } catch (err) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
  };

  // Credits (Cast & Crew)
  const getCredits = async (type: MediaType, id: number | string): Promise<CreditsResponse> => {
    if (!isConfigured.value) {
      return {
        id: Number(id),
        cast: [
          { id: 1, name: 'Lead Actor', character: 'Main Protagonist', profile_path: null, order: 0 },
          { id: 2, name: 'Co-Star Actor', character: 'Supporting Role', profile_path: null, order: 1 }
        ],
        crew: [
          { id: 3, name: 'Famous Director', job: 'Director', department: 'Directing', profile_path: null }
        ]
      };
    }
    try {
      return await fetchFromTmdb<CreditsResponse>(`/${type}/${id}/credits`);
    } catch (err) {
      return { id: Number(id), cast: [], crew: [] };
    }
  };

  // Similar Titles
  const getSimilar = async (type: MediaType, id: number | string): Promise<TMDBPaginatedResponse<MediaItem>> => {
    if (!isConfigured.value) {
      const items = type === 'movie' ? MOCK_MOVIES : MOCK_TV_SHOWS;
      return { page: 1, results: items, total_pages: 1, total_results: items.length };
    }
    try {
      return await fetchFromTmdb<TMDBPaginatedResponse<MediaItem>>(`/${type}/${id}/similar`);
    } catch (err) {
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
  };

  return {
    isConfigured,
    getImageUrl,
    getTrending,
    getPopular,
    getTopRated,
    getNowPlaying,
    getAiringToday,
    getGenres,
    getByGenre,
    getMovieDetails,
    getTVDetails,
    getSeasonDetails,
    getCredits,
    getSimilar,
    search
  };
};
