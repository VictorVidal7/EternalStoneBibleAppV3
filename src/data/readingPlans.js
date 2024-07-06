export const readingPlans = [
  {
    id: 'bible-in-a-year',
    name: 'La Biblia en un Año',
    description: 'Lee toda la Biblia en 365 días',
    duration: 365,
    readings: [
      { day: 1, passages: ['Génesis 1-3', 'Mateo 1'] },
      { day: 2, passages: ['Génesis 4-6', 'Mateo 2'] },
      { day: 3, passages: ['Génesis 7-9', 'Mateo 3'] },
      { day: 4, passages: ['Génesis 10-12', 'Mateo 4'] },
      { day: 5, passages: ['Génesis 13-15', 'Mateo 5:1-26'] },
      // ... Puedes continuar con más días aquí
    ]
  },
  {
    id: 'nt-in-90-days',
    name: 'Nuevo Testamento en 90 Días',
    description: 'Lee el Nuevo Testamento en 90 días',
    duration: 90,
    readings: [
      { day: 1, passages: ['Mateo 1-3'] },
      { day: 2, passages: ['Mateo 4-6'] },
      { day: 3, passages: ['Mateo 7-9'] },
      { day: 4, passages: ['Mateo 10-12'] },
      { day: 5, passages: ['Mateo 13-15'] },
      // ... Puedes continuar con más días aquí
    ]
  },
  {
    id: 'psalms-and-proverbs',
    name: 'Salmos y Proverbios en 31 Días',
    description: 'Lee Salmos y Proverbios en un mes',
    duration: 31,
    readings: [
      { day: 1, passages: ['Salmos 1-5', 'Proverbios 1'] },
      { day: 2, passages: ['Salmos 6-10', 'Proverbios 2'] },
      { day: 3, passages: ['Salmos 11-15', 'Proverbios 3'] },
      { day: 4, passages: ['Salmos 16-20', 'Proverbios 4'] },
      { day: 5, passages: ['Salmos 21-25', 'Proverbios 5'] },
      // ... Puedes continuar con más días aquí
    ]
  }
];