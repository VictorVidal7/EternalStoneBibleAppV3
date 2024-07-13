import { RV1909 } from '../data/completeBibleData';
import AsyncStorage from '@react-native-async-storage/async-storage';

let currentVersion = RV1909;
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
const CACHE_PREFIX = 'bible_data_';

const getFromCache = async (key) => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
    }
  } catch (error) {
    console.error('Error retrieving from cache:', error);
  }
  return null;
};

const setToCache = async (key, data) => {
  try {
    await AsyncStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (error) {
    console.error('Error setting to cache:', error);
  }
};

export const setCurrentVersion = (version) => {
  if (version === 'RV1909') {
    currentVersion = RV1909;
  } else {
    console.warn('Versión no disponible, usando RV1909 por defecto');
    currentVersion = RV1909;
  }
};

export const getVerse = async (book, chapter, verse) => {
  try {
    const cacheKey = `${book}_${chapter}_${verse}`;
    const cachedVerse = await getFromCache(cacheKey);
    if (cachedVerse) return cachedVerse;

    if (!currentVersion[book]) {
      console.error(`Book ${book} not found in currentVersion`);
      console.log('Available books:', Object.keys(currentVersion));
      throw new Error(`Book ${book} not found`);
    }
    if (!currentVersion[book][chapter]) {
      console.error(`Chapter ${chapter} not found in book ${book}`);
      console.log(`Available chapters for ${book}:`, Object.keys(currentVersion[book]));
      throw new Error(`Chapter ${chapter} not found in book ${book}`);
    }
    const verseData = currentVersion[book][chapter].find(v => v.number === parseInt(verse));
    if (!verseData) {
      console.error(`Verse ${verse} not found in chapter ${chapter} of book ${book}`);
      console.log(`Available verses for ${book} ${chapter}:`, currentVersion[book][chapter].map(v => v.number));
      throw new Error(`Verse ${verse} not found in chapter ${chapter} of book ${book}`);
    }
    await setToCache(cacheKey, verseData);
    return verseData;
  } catch (error) {
    console.error(`Error getting verse ${book} ${chapter}:${verse}:`, error);
    throw error;
  }
};

export const getChapter = async (book, chapter) => {
  try {
    const cacheKey = `${book}_${chapter}`;
    const cachedChapter = await getFromCache(cacheKey);
    if (cachedChapter) return cachedChapter;

    if (!currentVersion[book]) {
      throw new Error(`Book ${book} not found`);
    }
    if (!currentVersion[book][chapter]) {
      throw new Error(`Chapter ${chapter} not found in book ${book}`);
    }
    const chapterData = currentVersion[book][chapter];
    await setToCache(cacheKey, chapterData);
    return chapterData;
  } catch (error) {
    console.error(`Error getting chapter ${book} ${chapter}:`, error);
    throw error;
  }
};

export const getBookChapters = (book) => {
  if (!currentVersion[book]) {
    console.error(`Book ${book} not found`);
    return 0;
  }
  return Object.keys(currentVersion[book]).length;
};

export const getAllBooks = () => {
  return Object.keys(currentVersion);
};

export const searchBible = async (query, searchType = 'all') => {
  try {
    const cacheKey = `search_${query}_${searchType}`;
    const cachedResults = await getFromCache(cacheKey);
    if (cachedResults) return cachedResults;

    const results = [];
    const lowercaseQuery = query.toLowerCase();

    Object.entries(currentVersion).forEach(([book, chapters]) => {
      if ((searchType === 'ot' && book.indexOf('Nuevo') !== -1) || 
          (searchType === 'nt' && book.indexOf('Antiguo') !== -1)) {
        return;
      }

      Object.entries(chapters).forEach(([chapter, verses]) => {
        verses.forEach((verse) => {
          if (verse.text.toLowerCase().includes(lowercaseQuery)) {
            results.push({
              book,
              chapter: parseInt(chapter),
              number: verse.number,
              text: verse.text
            });
          }
        });
      });
    });

    await setToCache(cacheKey, results);
    return results;
  } catch (error) {
    console.error('Error searching Bible:', error);
    throw error;
  }
};