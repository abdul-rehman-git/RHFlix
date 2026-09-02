import type { WatchHistoryItem, MediaType } from '~/types/tmdb';

const STORAGE_KEY = 'marxi_watch_history';

export const useWatchHistory = () => {
  const history = useState<WatchHistoryItem[]>('marxi_watch_history', () => []);

  onMounted(() => {
    if (import.meta.client) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            history.value = parsed.filter(item => item && typeof item === 'object' && Boolean(item.tmdbId));
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (err) {
        console.error('Error reading Watch History from localStorage:', err);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (_) {}
      }
    }
  });

  const saveToStorage = (items: WatchHistoryItem[]) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (err) {
        console.error('Error saving Watch History to localStorage:', err);
      }
    }
  };

  const addWatchHistory = (entry: Omit<WatchHistoryItem, 'timestamp'>) => {
    if (!entry || !entry.tmdbId) return;

    const newItem: WatchHistoryItem = {
      ...entry,
      timestamp: Date.now()
    };

    // Filter out previous occurrences of the same movie or same TV show episode
    const updated = history.value.filter(item => {
      if (item.type !== entry.type || Number(item.tmdbId) !== Number(entry.tmdbId)) {
        return true;
      }
      if (entry.type === 'tv') {
        return !(Number(item.season) === Number(entry.season) && Number(item.episode) === Number(entry.episode));
      }
      return false;
    });

    updated.unshift(newItem);

    // Keep max 20 history items
    const truncated = updated.slice(0, 20);
    history.value = truncated;
    saveToStorage(truncated);
  };

  const removeHistoryItem = (tmdbId: number | string, type: MediaType) => {
    const targetId = Number(tmdbId);
    history.value = history.value.filter(i => !(Number(i.tmdbId) === targetId && i.type === type));
    saveToStorage(history.value);
  };

  const clearHistory = () => {
    history.value = [];
    if (import.meta.client) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }
  };

  return {
    history: readonly(history),
    addWatchHistory,
    removeHistoryItem,
    clearHistory
  };
};
