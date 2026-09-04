export type PlaybackProviderId = 'vidcore' | 'vidphantom' | 'nexstream' | 'vidsrc-hair';

export type PlaybackState = 'IDLE' | 'LOADING' | 'PLAYING' | 'FALLBACK' | 'FINAL_ERROR';

export type PlaybackMode = 'auto' | 'manual';

export interface PlaybackProvider {
  id: PlaybackProviderId;
  name: string;
  label: string;
  priority: number;
  isPrimary?: boolean;
  supportsMovie: boolean;
  supportsTV: boolean;
  supportsPostMessage?: boolean;
}

export interface PlaybackSession {
  mediaType: 'movie' | 'tv';
  tmdbId: number | string;
  season?: number | string;
  episode?: number | string;
  selectedProviderId: PlaybackProviderId;
  mode: PlaybackMode;
  attemptedProviders: Set<PlaybackProviderId>;
  failedProviders: Set<PlaybackProviderId>;
  currentState: PlaybackState;
}
