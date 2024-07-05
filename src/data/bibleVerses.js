export const bibleVerses = {
  'Génesis': {
    1: [
      { number: 1, text: "En el principio creó Dios los cielos y la tierra." },
      { number: 2, text: "Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas." },
      // ... más versículos
    ],
    // ... más capítulos
  },
  // ... más libros
};

export const bibleBooks = Object.keys(bibleVerses).reduce((acc, book) => {
  acc[book] = Object.keys(bibleVerses[book]).length;
  return acc;
}, {});

export const getVersesForChapter = (book, chapter) => {
  return bibleVerses[book] && bibleVerses[book][chapter] 
    ? bibleVerses[book][chapter] 
    : [];
};

export const getRandomVerse = () => {
  const books = Object.keys(bibleVerses);
  const randomBook = books[Math.floor(Math.random() * books.length)];
  const chapters = Object.keys(bibleVerses[randomBook]);
  const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
  const verses = bibleVerses[randomBook][randomChapter];
  const randomVerse = verses[Math.floor(Math.random() * verses.length)];
  
  return {
    book: randomBook,
    chapter: randomChapter,
    number: randomVerse.number,
    text: randomVerse.text
  };
};