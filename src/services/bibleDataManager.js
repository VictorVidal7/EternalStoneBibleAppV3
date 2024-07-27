import { RV1909 } from '../data/completeBibleData';
import BibleDatabaseService from './BibleDatabaseService';
import CacheService from './CacheService';

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
    throw error;
  }
};

export const initializeBibleData = async () => {
  try {
    await BibleDatabaseService.openDatabase();
    
    const sampleVerse = await BibleDatabaseService.getVerse('Génesis', 1, 1);
    if (!sampleVerse) {
      console.log('Populating database with initial data...');
      for (const [book, chapters] of Object.entries(currentVersion)) {
        console.log(`Inserting book: ${book} with ${Object.keys(chapters).length} chapters`);
        for (const [chapter, verses] of Object.entries(chapters)) {
          console.log(`Inserting chapter ${chapter} of ${book} with ${verses.length} verses`);
          for (const verse of verses) {
            await BibleDatabaseService.insertVerse(book, parseInt(chapter), verse.number, verse.text);
          }
        }
        console.log(`Finished inserting book: ${book}`);
      }
      console.log('Database population complete.');
    } else {
      console.log('Database already populated.');
    }

    // Verificación adicional para Mateo
    const mateoVerse = await BibleDatabaseService.getVerse('Mateo', 1, 1);
    if (mateoVerse) {
      console.log('Verificación: Mateo 1:1 está presente en la base de datos');
    } else {
      console.error('Verificación fallida: Mateo 1:1 no está en la base de datos');
    }

  } catch (error) {
    console.error('Error initializing Bible data:', error);
    throw error;
  }
};

export const getVerse = async (book, chapter, verse) => {
  const cacheKey = `verse_${book}_${chapter}_${verse}`;
  try {
    const cachedVerse = await CacheService.getItem(cacheKey);
    if (cachedVerse) return cachedVerse;

    const verseData = await BibleDatabaseService.getVerse(book, parseInt(chapter), parseInt(verse));
    if (!verseData) {
      throw new Error(`Verse ${verse} not found in chapter ${chapter} of book ${book}`);
    }
    await CacheService.setItem(cacheKey, verseData);
    return verseData;
  } catch (error) {
    console.error(`Error getting verse ${book} ${chapter}:${verse}:`, error);
    throw error;
  }
};

export const getChapter = async (book, chapter) => {
  const cacheKey = `chapter_${book}_${chapter}`;
  try {
    const chapterData = await CacheService.getOfflineData(cacheKey, async () => {
      const data = await BibleDatabaseService.getChapter(book, parseInt(chapter));
      if (data.length === 0) {
        throw new Error(`Chapter ${chapter} not found in book ${book}`);
      }
      return data.map(verse => ({
        number: verse.verse,
        text: verse.text
      }));
    });

    if (!chapterData) {
      throw new Error('No se pudo obtener el capítulo. Verifica tu conexión a internet.');
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
  if (!currentVersion) {
    console.warn('Current version is not set');
    return [];
  }
  return Object.keys(currentVersion);
};

export const searchBible = async (query, searchType = 'all', page = 1, pageSize = 20) => {
  try {
    const results = await BibleDatabaseService.searchVerses(query, page, pageSize);
    if (searchType !== 'all') {
      const books = getAllBooks();
      return results.filter(verse => {
        const isOT = books.indexOf(verse.book) < 39;
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
    throw error;
  }
};

export const getRandomVerse = async () => {
  try {
    const books = getAllBooks();
    const randomBook = books[Math.floor(Math.random() * books.length)];
    const chapterCount = getBookChapters(randomBook);
    const randomChapter = Math.floor(Math.random() * chapterCount) + 1;
    const chapterVerses = await getChapter(randomBook, randomChapter);
    const randomVerse = chapterVerses[Math.floor(Math.random() * chapterVerses.length)];
    
    console.log(`Random verse selected: ${randomBook} ${randomChapter}:${randomVerse.number}`);
    
    return {
      book: randomBook,
      chapter: randomChapter,
      number: randomVerse.number,
      text: randomVerse.text
    };
  } catch (error) {
    console.error('Error getting random verse:', error);
    throw error;
  }
};

export const getNextChapter = (book, chapter) => {
  const books = getAllBooks();
  const currentBookIndex = books.indexOf(book);
  const chapterCount = getBookChapters(book);

  if (chapter < chapterCount) {
    return { book, chapter: chapter + 1 };
  } else if (currentBookIndex < books.length - 1) {
    return { book: books[currentBookIndex + 1], chapter: 1 };
  } else {
    return null; // End of the Bible
  }
};

export const getPreviousChapter = (book, chapter) => {
  const books = getAllBooks();
  const currentBookIndex = books.indexOf(book);

  if (chapter > 1) {
    return { book, chapter: chapter - 1 };
  } else if (currentBookIndex > 0) {
    const previousBook = books[currentBookIndex - 1];
    const previousBookChapterCount = getBookChapters(previousBook);
    return { book: previousBook, chapter: previousBookChapterCount };
  } else {
    return null; // Beginning of the Bible
  }
};

export const preloadFrequentlyAccessedData = async () => {
  const frequentlyAccessedItems = [
    { key: 'book_list', fetcher: getAllBooks },
    { key: 'chapter_Genesis_1', fetcher: () => getChapter('Génesis', 1) },
    { key: 'chapter_Exodus_1', fetcher: () => getChapter('Éxodo', 1) },
    { key: 'chapter_Matthew_1', fetcher: () => getChapter('Mateo', 1) }, // Añadido para verificar Mateo
  ];

  const results = await Promise.allSettled(frequentlyAccessedItems.map(async item => {
    try {
      const data = await item.fetcher();
      await CacheService.setItem(item.key, data);
      console.log(`Successfully preloaded ${item.key}`);
      return { key: item.key, status: 'success' };
    } catch (error) {
      console.warn(`Error preloading ${item.key}:`, error.message);
      return { key: item.key, status: 'error', error: error.message };
    }
  }));

  const errors = results.filter(result => result.status === 'rejected' || (result.value && result.value.status === 'error'));
  if (errors.length > 0) {
    console.warn('Some items failed to preload:', errors.map(e => e.value ? e.value.key : e.reason).join(', '));
  } else {
    console.log('All frequently accessed data preloaded successfully');
  }
};