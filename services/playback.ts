import type { PlaybackProvider, PlaybackProviderId } from '~/types/playback';

export const PLAYBACK_PROVIDERS: PlaybackProvider[] = [
  {
    id: 'vidcore',
    name: 'VidCore',
    label: 'Server 1 (VidCore)',
    priority: 1,
    isPrimary: true,
    supportsMovie: true,
    supportsTV: true,
    supportsPostMessage: true
  },
  {
    id: 'vidphantom',
    name: 'VidPhantom',
    label: 'Server 2 (VidPhantom)',
    priority: 2,
    supportsMovie: true,
    supportsTV: true,
    supportsPostMessage: true
  },
  {
    id: 'nexstream',
    name: 'NexStream',
    label: 'Server 3 (NexStream)',
    priority: 3,
    supportsMovie: true,
    supportsTV: true,
    supportsPostMessage: true
  },
  {
    id: 'vidsrc-hair',
    name: 'VidSrc Hair',
    label: 'Server 4 (VidSrc Hair)',
    priority: 4,
    supportsMovie: true,
    supportsTV: true,
    supportsPostMessage: false
  }
];

export const getProviderById = (id: PlaybackProviderId): PlaybackProvider => {
  return PLAYBACK_PROVIDERS.find(p => p.id === id) || PLAYBACK_PROVIDERS[0];
};

export const getAllProviders = (): PlaybackProvider[] => {
  return [...PLAYBACK_PROVIDERS].sort((a, b) => a.priority - b.priority);
};

export const getNextProvider = (
  currentId: PlaybackProviderId, 
  failedIds: Set<PlaybackProviderId> | PlaybackProviderId[]
): PlaybackProvider | null => {
  const failedSet = failedIds instanceof Set ? failedIds : new Set(failedIds);
  const remaining = PLAYBACK_PROVIDERS
    .filter(p => !failedSet.has(p.id))
    .sort((a, b) => a.priority - b.priority);

  return remaining.length > 0 ? remaining[0] : null;
};

/**
 * Builds the movie playback URL for the specified provider using URL / URLSearchParams objects.
 * Passes clean `?lang=${defaultLang}` to VidCore.
 */
export const buildMoviePlaybackUrl = (
  providerId: PlaybackProviderId, 
  tmdbId: number | string,
  defaultLang?: string,
  useMirror: boolean = false
): string => {
  const id = String(tmdbId);

  switch (providerId) {
    case 'vidcore': {
      const baseUrl = useMirror 
        ? `https://vidlink.pro/movie/${id}`
        : `https://vidcore.org/embed/movie/${id}`;
      const url = new URL(baseUrl);
      if (defaultLang) {
        url.searchParams.set('lang', defaultLang);
      }
      return url.toString();
    }
    case 'vidphantom': {
      const baseUrl = useMirror 
        ? `https://vidsrc.cc/v2/embed/movie/${id}`
        : `https://vidphantom.com/movie/${id}`;
      const url = new URL(baseUrl);
      if (defaultLang) {
        url.searchParams.set('lang', defaultLang);
      }
      return url.toString();
    }
    case 'nexstream': {
      const baseUrl = useMirror 
        ? `https://embed.su/embed/movie/${id}`
        : `https://watch.embed-api.stream/embed/movie/${id}`;
      const url = new URL(baseUrl);
      if (!useMirror) {
        url.searchParams.set('hidetitle', '1');
        url.searchParams.set('title', '0');
        if (defaultLang) {
          url.searchParams.set('lang', defaultLang);
        }
      }
      return url.toString();
    }
    case 'vidsrc-hair':
    default: {
      if (useMirror) {
        const url = new URL('https://vidsrc.me/embed/movie');
        url.searchParams.set('tmdb', id);
        return url.toString();
      }
      return `https://vidsrc.hair/embed/movie/${id}`;
    }
  }
};

/**
 * Builds the TV episode playback URL for the specified provider using URL / URLSearchParams objects.
 * Passes clean `?lang=${defaultLang}` to VidCore.
 */
export const buildEpisodePlaybackUrl = (
  providerId: PlaybackProviderId,
  tmdbId: number | string,
  season: number | string = 1,
  episode: number | string = 1,
  defaultLang?: string,
  useMirror: boolean = false
): string => {
  const id = String(tmdbId);
  const s = String(season);
  const e = String(episode);

  switch (providerId) {
    case 'vidcore': {
      const baseUrl = useMirror 
        ? `https://vidlink.pro/tv/${id}/${s}/${e}`
        : `https://vidcore.org/embed/tv/${id}/${s}/${e}`;
      const url = new URL(baseUrl);
      if (defaultLang) {
        url.searchParams.set('lang', defaultLang);
      }
      return url.toString();
    }
    case 'vidphantom': {
      const baseUrl = useMirror 
        ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`
        : `https://vidphantom.com/tv/${id}/${s}/${e}`;
      const url = new URL(baseUrl);
      if (defaultLang) {
        url.searchParams.set('lang', defaultLang);
      }
      return url.toString();
    }
    case 'nexstream': {
      const baseUrl = useMirror 
        ? `https://embed.su/embed/tv/${id}/${s}/${e}`
        : `https://watch.embed-api.stream/embed/tv/${id}/${s}/${e}`;
      const url = new URL(baseUrl);
      if (!useMirror) {
        url.searchParams.set('hidetitle', '1');
        url.searchParams.set('title', '0');
        if (defaultLang) {
          url.searchParams.set('lang', defaultLang);
        }
      }
      return url.toString();
    }
    case 'vidsrc-hair':
    default: {
      if (useMirror) {
        const url = new URL('https://vidsrc.me/embed/tv');
        url.searchParams.set('tmdb', id);
        url.searchParams.set('season', s);
        url.searchParams.set('episode', e);
        return url.toString();
      }
      return `https://vidsrc.hair/embed/tv/${id}/${s}/${e}`;
    }
  }
};

export const getMoviePlaybackUrl = buildMoviePlaybackUrl;
export const getEpisodePlaybackUrl = buildEpisodePlaybackUrl;
