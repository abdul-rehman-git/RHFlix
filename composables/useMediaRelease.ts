import type { MediaItem, MovieDetails, TVDetails, Episode, Season } from '~/types/tmdb';

export type ReleaseCheckable = 
  | MediaItem 
  | MovieDetails 
  | TVDetails 
  | Episode 
  | Season 
  | { release_date?: string; first_air_date?: string; air_date?: string; status?: string; [key: string]: any }
  | null 
  | undefined;

export const useMediaRelease = () => {
  /**
   * Checks whether a movie, TV show, season, or episode is unreleased or coming soon.
   */
  const isComingSoon = (item?: ReleaseCheckable): boolean => {
    if (!item) return false;

    // 1. Check TMDB production status if available (e.g. from MovieDetails / TVDetails)
    if ('status' in item && item.status) {
      const unreleasedStatuses = [
        'Post Production',
        'In Production',
        'Planned',
        'Rumored',
        'Canceled',
        'Upcoming'
      ];
      if (unreleasedStatuses.includes(item.status)) {
        return true;
      }
    }

    // 2. Extract release date, first air date, or episode/season air date
    const dateStr = (item as any).release_date || (item as any).first_air_date || (item as any).air_date;
    if (!dateStr || typeof dateStr !== 'string' || dateStr.trim().length === 0) {
      // If status is present and not explicitly released/ended
      if ('status' in item && item.status) {
        return !['Released', 'Ended', 'Returning Series'].includes(item.status);
      }
      return false;
    }

    // 3. Compare with today's date in local/ISO format
    try {
      const today = new Date().toISOString().split('T')[0];
      const trimmedDate = dateStr.trim();
      
      // If only year is given: e.g. "2027"
      if (trimmedDate.length === 4) {
        return parseInt(trimmedDate, 10) > parseInt(today.substring(0, 4), 10);
      }
      // If year and month is given: e.g. "2027-05"
      if (trimmedDate.length === 7) {
        return trimmedDate > today.substring(0, 7);
      }
      // Full date string YYYY-MM-DD
      return trimmedDate > today;
    } catch (_) {
      return false;
    }
  };

  /**
   * Formats the release date into a clean display string (e.g. "Nov 20, 2026" or "2026").
   */
  const formatReleaseDate = (item?: ReleaseCheckable): string => {
    if (!item) return 'Coming Soon';
    const dateStr = (item as any).release_date || (item as any).first_air_date || (item as any).air_date;
    if (!dateStr) return 'Coming Soon';

    try {
      const trimmed = dateStr.trim();
      if (trimmed.length === 4) return trimmed;
      const d = new Date(trimmed);
      if (isNaN(d.getTime())) return trimmed;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (_) {
      return dateStr;
    }
  };

  /**
   * Returns whether the item can be actively played right now.
   */
  const canPlay = (item?: ReleaseCheckable): boolean => {
    return !isComingSoon(item);
  };

  return {
    isComingSoon,
    formatReleaseDate,
    canPlay
  };
};
