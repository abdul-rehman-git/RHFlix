import type { MediaItem, MediaType } from '~/types/tmdb';

const STORAGE_KEY = 'marxi_my_list';

export const useMyList = () => {
  const myList = useState<MediaItem[]>('marxi_my_list', () => []);

  onMounted(() => {
    if (import.meta.client && myList.value.length === 0) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            myList.value = parsed.filter(item => item && typeof item === 'object' && Boolean(item.id));
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (err) {
        console.error('Error reading My List from LocalStorage:', err);
      }
    }
  });

  const saveToStorage = (items: MediaItem[]) => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (err) {
        console.error('Error saving My List to LocalStorage:', err);
      }
    }
  };

  const isInList = (id: number | string, type: MediaType = 'movie'): boolean => {
    const targetId = Number(id);
    return myList.value.some(item => {
      const itemType = item.media_type || (item.title ? 'movie' : 'tv');
      return Number(item.id) === targetId && itemType === type;
    });
  };

  const toggleMyList = (item: MediaItem) => {
    if (!item || !item.id) return;

    const type: MediaType = item.media_type || (item.title ? 'movie' : 'tv');
    const existingIndex = myList.value.findIndex(i => {
      const iType: MediaType = i.media_type || (i.title ? 'movie' : 'tv');
      return Number(i.id) === Number(item.id) && iType === type;
    });

    if (existingIndex > -1) {
      myList.value.splice(existingIndex, 1);
    } else {
      myList.value.unshift({
        ...item,
        media_type: type
      });
    }

    saveToStorage(myList.value);
  };

  const removeItem = (id: number | string, type: MediaType) => {
    const targetId = Number(id);
    myList.value = myList.value.filter(i => {
      const iType: MediaType = i.media_type || (i.title ? 'movie' : 'tv');
      return !(Number(i.id) === targetId && iType === type);
    });
    saveToStorage(myList.value);
  };

  return {
    myList: readonly(myList),
    isInList,
    toggleMyList,
    removeItem
  };
};
