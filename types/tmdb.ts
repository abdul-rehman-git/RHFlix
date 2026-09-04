export type MediaType = 'movie' | 'tv';

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  title?: string;
  name?: string; // TV shows use name
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: MediaType;
  genre_ids?: number[];
  genres?: Genre[];
  popularity: number;
  release_date?: string; // Movies
  first_air_date?: string; // TV
  vote_average: number;
  vote_count: number;
}

export interface MovieDetails extends MediaItem {
  runtime?: number;
  status?: string;
  tagline?: string;
  budget?: number;
  revenue?: number;
  original_language?: string;
  genres: Genre[];
}

export interface TVDetails extends MediaItem {
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: Season[];
  status?: string;
  tagline?: string;
  genres: Genre[];
  original_language?: string;
}

export interface Season {
  id: number;
  air_date?: string;
  episode_count: number;
  name: string;
  overview?: string;
  poster_path: string | null;
  season_number: number;
  vote_average?: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date?: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  runtime?: number;
}

export interface SeasonDetails {
  _id?: string;
  air_date?: string;
  episodes: Episode[];
  name: string;
  overview?: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}

export interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface CreditsResponse {
  id: number;
  cast: CastMember[];
  crew: CrewMember[];
}

export type { WatchHistoryItem, MyListItem } from './user';
