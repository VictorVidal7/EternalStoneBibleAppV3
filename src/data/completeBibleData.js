export const RV1909 = {
  "Génesis": {
    1: [
      { number: 1, text: "En el principio creó Dios los cielos y la tierra." },
      { number: 2, text: "Y la tierra estaba desordenada y vacía, y las tinieblas estaban sobre la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas." },
      { number: 3, text: "Y dijo Dios: Sea la luz; y fue la luz." },
      // ... (más versículos)
    ],
    2: [
      { number: 1, text: "Y fueron acabados los cielos y la tierra, y todo su ornamento." },
      { number: 2, text: "Y acabó Dios en el día séptimo la obra que hizo; y reposó el día séptimo de toda la obra que hizo." },
      { number: 3, text: "Y bendijo Dios al día séptimo, y lo santificó, porque en él reposó de toda la obra que había Dios creado y hecho." },
      // ... (más versículos)
    ],
    3: [
      { number: 1, text: "Pero la serpiente era astuta, más que todos los animales del campo que Jehová Dios había hecho; la cual dijo á la mujer: ¿Conque Dios os ha dicho: No comáis de todo árbol del huerto?" },
      // ... (más versículos)
    ],
    // ... (más capítulos)
  },
  "Éxodo": {
    1: [
      { number: 1, text: "Estos son los nombres de los hijos de Israel, que entraron en Egipto con Jacob; cada uno entró con su familia." },
      // ... (más versículos)
    ],
    // ... (más capítulos)
  },
  // ... (más libros)
};

// Verificación de la estructura de datos
Object.entries(RV1909).forEach(([book, chapters]) => {
  console.log(`Book: ${book}, Chapters: ${Object.keys(chapters).length}`);
  Object.entries(chapters).forEach(([chapter, verses]) => {
    console.log(`  Chapter ${chapter}: ${verses.length} verses`);
  });
});