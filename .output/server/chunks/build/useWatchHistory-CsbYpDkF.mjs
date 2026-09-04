import { f as useState } from './server.mjs';
import { readonly } from 'vue';

const throttledSave = (items) => {
  return;
};
const useWatchHistory = () => {
  const history = useState("marxi_watch_history", () => []);
  const addWatchHistory = (entry) => {
    if (!entry || !entry.tmdbId) return;
    const newItem = {
      ...entry,
      lastWatchedAt: Date.now()
    };
    const updated = history.value.filter((item) => {
      if (item.type !== entry.type || String(item.tmdbId) !== String(entry.tmdbId)) {
        return true;
      }
      if (entry.type === "tv") {
        return !(Number(item.season) === Number(entry.season) && Number(item.episode) === Number(entry.episode));
      }
      return false;
    });
    updated.unshift(newItem);
    const truncated = updated.slice(0, 24);
    history.value = truncated;
  };
  const updateProgress = (tmdbId, type, progress, duration) => {
    const id = String(tmdbId);
    const index = history.value.findIndex((i) => String(i.tmdbId) === id && i.type === type);
    if (index > -1) {
      const items = [...history.value];
      items[index] = {
        ...items[index],
        progress,
        duration: duration || items[index].duration,
        lastWatchedAt: Date.now()
      };
      history.value = items;
    }
  };
  const removeHistoryItem = (tmdbId, type) => {
    const id = String(tmdbId);
    history.value = history.value.filter((i) => !(String(i.tmdbId) === id && i.type === type));
    throttledSave(history.value);
  };
  const clearHistory = () => {
    history.value = [];
  };
  return {
    history: readonly(history),
    addWatchHistory,
    updateProgress,
    removeHistoryItem,
    clearHistory
  };
};

export { useWatchHistory as u };
//# sourceMappingURL=useWatchHistory-CsbYpDkF.mjs.map
