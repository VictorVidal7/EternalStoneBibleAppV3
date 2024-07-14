import AsyncStorage from '@react-native-async-storage/async-storage';
import LRU from 'lru-cache';

const CACHE_PREFIX = 'bible_cache_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 días
const MAX_CACHE_SIZE = 100; // Número máximo de elementos en caché

class CacheService {
  constructor() {
    this.memoryCache = new LRU({
      max: MAX_CACHE_SIZE,
      maxAge: CACHE_EXPIRY
    });
  }

  async setItem(key, value, expiry = CACHE_EXPIRY) {
    const item = {
      value,
      expiry: Date.now() + expiry,
    };
    this.memoryCache.set(key, item);
    try {
      await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting cache item:', error);
    }
  }

  async getItem(key) {
    let item = this.memoryCache.get(key);
    if (item && Date.now() < item.expiry) {
      return item.value;
    }

    try {
      const value = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (value !== null) {
        item = JSON.parse(value);
        if (Date.now() < item.expiry) {
          this.memoryCache.set(key, item);
          return item.value;
        }
        await AsyncStorage.removeItem(CACHE_PREFIX + key);
      }
    } catch (error) {
      console.error('Error getting cache item:', error);
    }
    return null;
  }

  async removeItem(key) {
    this.memoryCache.del(key);
    try {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error('Error removing cache item:', error);
    }
  }

  async clear() {
    this.memoryCache.reset();
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async getCacheSize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      return cacheKeys.length;
    } catch (error) {
      console.error('Error getting cache size:', error);
      return 0;
    }
  }

  async pruneExpiredItems() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      const now = Date.now();

      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
          const item = JSON.parse(value);
          if (now >= item.expiry) {
            await AsyncStorage.removeItem(key);
            this.memoryCache.del(key.replace(CACHE_PREFIX, ''));
          }
        }
      }
    } catch (error) {
      console.error('Error pruning expired items:', error);
    }
  }
}

export default new CacheService();