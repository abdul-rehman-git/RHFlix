import { f as useState } from './server.mjs';
import { readonly } from 'vue';

const useWatchHistory = () => {
  const history = useState("marxi_watch_history", () => []);
  const saveToStorage = (items) => {
  };
  const addWatchHistory = (entry) => {
    if (!entry || !entry.tmdbId) return;
    const newItem = {
      ...entry,
      timestamp: Date.now()
    };
    const updated = history.value.filter((item) => {
      if (item.type !== entry.type || Number(item.tmdbId) !== Number(entry.tmdbId)) {
        return true;
      }
      if (entry.type === "tv") {
        return !(Number(item.season) === Number(entry.season) && Number(item.episode) === Number(entry.episode));
      }
      return false;
    });
    updated.unshift(newItem);
    const truncated = updated.slice(0, 20);
    history.value = truncated;
  };
  const removeHistoryItem = (tmdbId, type) => {
    const targetId = Number(tmdbId);
    history.value = history.value.filter((i) => !(Number(i.tmdbId) === targetId && i.type === type));
    saveToStorage(history.value);
  };
  const clearHistory = () => {
    history.value = [];
  };
  return {
    history: readonly(history),
    addWatchHistory,
    removeHistoryItem,
    clearHistory
  };
};

export { useWatchHistory as u };
//# sourceMappingURL=useWatchHistory-Dtam6eb4.mjs.map
