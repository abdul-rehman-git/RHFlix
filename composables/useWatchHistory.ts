import type { WatchHistoryItem, MediaType } from '~/types/tmdb';

const STORAGE_KEY = 'marxi_watch_history';

// Safe localStorage saver with QuotaExceeded error handling
const saveToLocalStorage = (items: WatchHistoryItem[]) => {
  if (!import.meta.client) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err: any) {
    if (err.name === 'QuotaExceededError' || err.code === 22) {
      console.warn('[Storage Error] LocalStorage quota exceeded. Pruning old watch history...');
      // Prune oldest items to free up space
      const pruned = items.slice(0, 10);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
      } catch (_) {}
    } else {
      console.error('Error saving Watch History to LocalStorage:', err);
    }
  }
};

let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const throttledSave = (items: WatchHistoryItem[]) => {
  if (!import.meta.client) return;
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveToLocalStorage(items);
  }, 400);
};

export const useWatchHistory = () => {
  const history = useState<WatchHistoryItem[]>('marxi_watch_history', () => []);

  const loadFromStorage = () => {
    if (!import.meta.client) return;
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
  };

  onMounted(() => {
    if (import.meta.client) {
      if (history.value.length === 0) {
        loadFromStorage();
      }

      // Task C: Multi-Tab Storage Synchronization
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY) {
          loadFromStorage();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      onUnmounted(() => {
        window.removeEventListener('storage', handleStorageChange);
      });
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

  const updateProgress = (
    tmdbId: number | string, 
    type: MediaType, 
    progress: number, 
    duration?: number,
    season?: number,
    episode?: number
  ) => {
    const id = String(tmdbId);
    const index = history.value.findIndex(i => {
      if (String(i.tmdbId) !== id || i.type !== type) return false;
      if (type === 'tv') {
        return Number(i.season) === Number(season || 1) && Number(i.episode) === Number(episode || 1);
      }
      return true;
    });

    if (index > -1) {
      const items = [...history.value];
      items[index] = {
        ...items[index],
        progress: Math.floor(progress),
        duration: duration ? Math.floor(duration) : items[index].duration,
        lastWatchedAt: Date.now()
      };
      history.value = items;
      throttledSave(items);
    }
  };

  const getItemProgress = (
    tmdbId: number | string, 
    type: MediaType, 
    season?: number, 
    episode?: number
  ): WatchHistoryItem | undefined => {
    const id = String(tmdbId);
    return history.value.find(i => {
      if (String(i.tmdbId) !== id || i.type !== type) return false;
      if (type === 'tv' && season !== undefined && episode !== undefined) {
        return Number(i.season) === Number(season) && Number(i.episode) === Number(episode);
      }
      return true;
    });
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
    getItemProgress,
    removeHistoryItem,
    clearHistory
  };
};
