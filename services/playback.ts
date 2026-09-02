export type PlaybackProviderId = 'embed-api-stream' | 'vidphantom';

export interface PlaybackProvider {
  id: PlaybackProviderId;
  name: string;
  isPrimary?: boolean;
}

export const PLAYBACK_PROVIDERS: PlaybackProvider[] = [
  {
    id: 'embed-api-stream',
    name: 'Embed API Stream',
    isPrimary: true
  },
  {
    id: 'vidphantom',
    name: 'VidPhantom',
    isPrimary: false
  }
];

export const getMoviePlaybackUrl = (
  provider: PlaybackProviderId, 
  tmdbId: number | string,
  lang: string = 'en'
): string => {
  const id = String(tmdbId);
  const langParam = lang === 'hi' ? '&ds_lang=hi&lang=hi&audio=hi' : '';
  switch (provider) {
    case 'vidphantom':
      return `https://vidphantom.com/movie/${id}?lang=${lang}`;
    case 'embed-api-stream':
    default:
      return `https://watch.embed-api.stream/embed/movie/${id}?hidetitle=1&title=0${langParam}`;
  }
};

export const getEpisodePlaybackUrl = (
  provider: PlaybackProviderId,
  tmdbId: number | string,
  season: number | string = 1,
  episode: number | string = 1,
  lang: string = 'en'
): string => {
  const id = String(tmdbId);
  const s = String(season);
  const e = String(episode);
  const langParam = lang === 'hi' ? '&ds_lang=hi&lang=hi&audio=hi' : '';
  switch (provider) {
    case 'vidphantom':
      return `https://vidphantom.com/tv/${id}/${s}/${e}?lang=${lang}`;
    case 'embed-api-stream':
    default:
      return `https://watch.embed-api.stream/embed/tv/${id}/${s}/${e}?hidetitle=1&title=0${langParam}`;
  }
};
