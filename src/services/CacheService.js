import AsyncStorage from '@react-native-async-storage/async-storage';
import LRU from 'lru-cache';

const CACHE_PREFIX = 'bible_cache_';
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 días
const MAX_CACHE_SIZE = 1000; // Aumentado para almacenar más elementos

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
}

export default new CacheService();