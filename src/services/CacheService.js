import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'bible_cache_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 días

export const CacheService = {
  setItem: async (key, value, expiry = CACHE_EXPIRY) => {
    try {
      const item = {
        value,
        expiry: Date.now() + expiry,
      };
      await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting cache item:', error);
    }
  },

  getItem: async (key) => {
    try {
      const value = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (value !== null) {
        const item = JSON.parse(value);
        if (Date.now() < item.expiry) {
          return item.value;
        }
        // Si el ítem ha expirado, lo eliminamos
        await AsyncStorage.removeItem(CACHE_PREFIX + key);
      }
    } catch (error) {
      console.error('Error getting cache item:', error);
    }
    return null;
  },

  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error('Error removing cache item:', error);
    }
  },

  clear: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },
};