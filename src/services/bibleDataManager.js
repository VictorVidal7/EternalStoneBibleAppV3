import { RV1909 } from '../data/completeBibleData';
import BibleDatabaseService from './BibleDatabaseService';

let currentVersion = RV1909;

export const setCurrentVersion = (version) => {
  if (version === 'RV1909') {
    currentVersion = RV1909;
  } else {
    console.warn('Versión no disponible, usando RV1909 por defecto');
    currentVersion = RV1909;
  }
};

export const resetDatabase = async () => {
  try {
    await BibleDatabaseService.openDatabase();
    await BibleDatabaseService.dropTable();
    await BibleDatabaseService.createTables();
    console.log('Database reset complete');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
};

export const initializeBibleData = async () => {
  try {
    await BibleDatabaseService.openDatabase();
    
    // Check if the database is empty
    const sampleVerse = await BibleDatabaseService.getVerse('Génesis', 1, 1);
    if (!sampleVerse) {
      console.log('Populating database with initial data...');
      for (const [book, chapters] of Object.entries(currentVersion)) {
        for (const [chapter, verses] of Object.entries(chapters)) {
          for (const verse of verses) {
            await BibleDatabaseService.insertVerse(book, parseInt(chapter), verse.number, verse.text);
          }
        }
      }
      console.log('Database population complete.');
    } else {
      console.log('Database already populated.');
    }
  } catch (error) {
    console.error('Error initializing Bible data:', error);
  }
};

export const getVerse = async (book, chapter, verse) => {
  try {
    const verseData = await BibleDatabaseService.getVerse(book, parseInt(chapter), parseInt(verse));
    if (!verseData) {
      throw new Error(`Verse ${verse} not found in chapter ${chapter} of book ${book}`);
    }
    return verseData;
  } catch (error) {
    console.error(`Error getting verse ${book} ${chapter}:${verse}:`, error);
    throw error;
  }
};

export const getChapter = async (book, chapter) => {
  try {
    const chapterData = await BibleDatabaseService.getChapter(book, parseInt(chapter));
    if (chapterData.length === 0) {
      throw new Error(`Chapter ${chapter} not found in book ${book}`);
    }
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
    const results = await BibleDatabaseService.searchVerses(query);
    if (searchType !== 'all') {
      return results.filter(verse => {
        const isOT = Object.keys(currentVersion).indexOf(verse.book) < 39;
        return searchType === 'ot' ? isOT : !isOT;
      });
    }
    return results;
  } catch (error) {
    console.error('Error searching Bible:', error);
    throw error;
  }
};

export const closeBibleDatabase = async () => {
  try {
    await BibleDatabaseService.close();
  } catch (error) {
    console.error('Error closing Bible database:', error);
  }
};