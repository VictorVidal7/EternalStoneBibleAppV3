import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

const CACHE_PREFIX = 'bible_cache_';
const DEFAULT_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 días

class CacheService {
  async setItem(key, value, expiry = DEFAULT_EXPIRY) {
    const item = {
      value,
      expiry: Date.now() + expiry,
    };
    try {
      await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting cache item:', error);
    }
  }

  async getItem(key) {
    try {
      const value = await AsyncStorage.getItem(CACHE_PREFIX + key);
      if (value !== null) {
        const item = JSON.parse(value);
        if (Date.now() < item.expiry) {
          return item.value;
        }
        // Si el item ha expirado, lo eliminamos
        await AsyncStorage.removeItem(CACHE_PREFIX + key);
      }
    } catch (error) {
      console.error('Error getting cache item:', error);
    }
    return null;
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error('Error removing cache item:', error);
    }
  }

  async clear() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async preloadFrequentlyAccessed(items) {
    const promises = items.map(async (item) => {
      const { key, fetcher } = item;
      const cachedItem = await this.getItem(key);
      if (!cachedItem) {
        const value = await fetcher();
        await this.setItem(key, value);
      }
    });

    await Promise.all(promises);
  }

  async getOfflineData(key, fetcher) {
    const cachedData = await this.getItem(key);
    if (cachedData) {
      return cachedData;
    }

    const isConnected = await this.checkConnection();
    if (isConnected) {
      const data = await fetcher();
      await this.setItem(key, data);
      return data;
    }

    return null;
  }

  async checkConnection() {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected;
  }

  async syncOfflineData(syncFunction) {
    const isConnected = await this.checkConnection();
    if (isConnected) {
      await syncFunction();
    }
  }
}

export default new CacheService();