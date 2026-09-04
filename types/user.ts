import type { MediaType } from './tmdb';

export interface WatchHistoryItem {
  tmdbId: number | string;
  type: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  season?: number;
  episode?: number;
  episodeName?: string;
  progress?: number; // In seconds or percentage
  duration?: number; // In seconds
  lastWatchedAt: number; // Unix timestamp
  providerId?: string;
}

export interface MyListItem {
  id: number | string;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: MediaType;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  addedAt: number;
}
