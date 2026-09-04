import type { WatchHistoryItem, MediaType } from '~/types/tmdb';

const STORAGE_KEY = 'marxi_watch_history';

// Throttle helper for disk writes
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const throttledSave = (items: WatchHistoryItem[]) => {
  if (!import.meta.client) return;
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving Watch History to LocalStorage:', err);
    }
  }, 400);
};

export const useWatchHistory = () => {
  const history = useState<WatchHistoryItem[]>('marxi_watch_history', () => []);

  onMounted(() => {
    if (import.meta.client && history.value.length === 0) {
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
        console.error('Error reading Watch History from LocalStorage:', err);
      }
    }
  });

  const addWatchHistory = (entry: Omit<WatchHistoryItem, 'lastWatchedAt'>) => {
    if (!entry || !entry.tmdbId) return;

    const newItem: WatchHistoryItem = {
      ...entry,
      lastWatchedAt: Date.now()
    };

    // Filter out existing occurrence of same movie or same TV episode
    const updated = history.value.filter(item => {
      if (item.type !== entry.type || String(item.tmdbId) !== String(entry.tmdbId)) {
        return true;
      }
      if (entry.type === 'tv') {
        return !(Number(item.season) === Number(entry.season) && Number(item.episode) === Number(entry.episode));
      }
      return false;
    });

    updated.unshift(newItem);

    // Keep max 24 items in watch history
    const truncated = updated.slice(0, 24);
    history.value = truncated;
    throttledSave(truncated);
  };

  const updateProgress = (tmdbId: number | string, type: MediaType, progress: number, duration?: number) => {
    const id = String(tmdbId);
    const index = history.value.findIndex(i => String(i.tmdbId) === id && i.type === type);
    if (index > -1) {
      const items = [...history.value];
      items[index] = {
        ...items[index],
        progress,
        duration: duration || items[index].duration,
        lastWatchedAt: Date.now()
      };
      history.value = items;
      throttledSave(items);
    }
  };

  const removeHistoryItem = (tmdbId: number | string, type: MediaType) => {
    const id = String(tmdbId);
    history.value = history.value.filter(i => !(String(i.tmdbId) === id && i.type === type));
    throttledSave(history.value);
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
    updateProgress,
    removeHistoryItem,
    clearHistory
  };
};
