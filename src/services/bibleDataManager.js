import { RV1909 } from '../data/completeBibleData';

let currentVersion = RV1909;

export const setCurrentVersion = async (version) => {
  if (version === 'RV1909') {
    currentVersion = RV1909;
  } else {
    // Aquí iría la lógica para cargar otras versiones si las tuviéramos
    console.warn('Versión no disponible, usando RV1909 por defecto');
    currentVersion = RV1909;
  }
};

export const getVerse = (book, chapter, verse) => {
  return currentVersion[book][chapter].find(v => v.number === verse);
};

export const getChapter = (book, chapter) => {
  return currentVersion[book][chapter];
};

export const getBookChapters = (book) => {
  return Object.keys(currentVersion[book]).length;
};

export const getAllBooks = () => {
  return Object.keys(currentVersion);
};

export const searchBible = (query, searchType = 'all') => {
  const results = [];
  const lowercaseQuery = query.toLowerCase();

  Object.entries(currentVersion).forEach(([book, chapters]) => {
    if (searchType === 'ot' && book.indexOf('Nuevo') !== -1) return;
    if (searchType === 'nt' && book.indexOf('Antiguo') !== -1) return;

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

  return results;
};