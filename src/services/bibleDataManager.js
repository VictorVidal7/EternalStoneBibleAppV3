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
  const cacheKey = `${book}_${chapter}_${verse}`;
  const cachedVerse = await getFromCache(cacheKey);
  if (cachedVerse) return cachedVerse;

  const verseData = currentVersion[book][chapter].find(v => v.number === verse);
  await setToCache(cacheKey, verseData);
  return verseData;
};

export const getChapter = async (book, chapter) => {
  const cacheKey = `${book}_${chapter}`;
  const cachedChapter = await getFromCache(cacheKey);
  if (cachedChapter) return cachedChapter;

  const chapterData = currentVersion[book][chapter];
  await setToCache(cacheKey, chapterData);
  return chapterData;
};

export const getBookChapters = (book) => {
  return Object.keys(currentVersion[book]).length;
};

export const getAllBooks = () => {
  return Object.keys(currentVersion);
};

export const searchBible = async (query, searchType = 'all') => {
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
};