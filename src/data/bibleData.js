export const bibleBooks = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
  // ... (resto de los libros)
];

export const getChapter = (book, chapter) => {
  console.log(`Getting chapter for ${book} ${chapter}`);
  // Aquí deberías implementar la lógica para obtener el contenido real del capítulo
  // Por ahora, retornamos un capítulo de ejemplo
  const exampleChapter = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    text: `Este es el versículo ${i + 1} del capítulo ${chapter} de ${book}.`
  }));
  console.log(`Returning ${exampleChapter.length} verses`);
  return exampleChapter;
};