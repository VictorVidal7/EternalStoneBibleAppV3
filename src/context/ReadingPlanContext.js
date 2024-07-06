import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReadingPlanContext = createContext();

export const ReadingPlanProvider = ({ children }) => {
  console.log('ReadingPlanProvider iniciado');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [progress, setProgress] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadReadingPlan();
  }, []);

  const loadReadingPlan = async () => {
    try {
      console.log('Cargando plan de lectura...');
      const savedPlan = await AsyncStorage.getItem('currentReadingPlan');
      const savedProgress = await AsyncStorage.getItem('readingPlanProgress');
      if (savedPlan) setCurrentPlan(JSON.parse(savedPlan));
      if (savedProgress) setProgress(JSON.parse(savedProgress));
      console.log('Plan de lectura cargado:', { currentPlan, progress });
      setIsLoaded(true);
    } catch (error) {
      console.error('Error al cargar el plan de lectura:', error);
      setIsLoaded(true);
    }
  };

  const savePlan = async (plan) => {
    try {
      console.log('Saving plan:', plan);
      await AsyncStorage.setItem('currentReadingPlan', JSON.stringify(plan));
      setCurrentPlan(plan);
    } catch (error) {
      console.error('Error al guardar el plan de lectura:', error);
    }
  };

  const updateProgress = async (day) => {
    try {
      const newProgress = { ...progress, [day]: true };
      await AsyncStorage.setItem('readingPlanProgress', JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Error al actualizar el progreso:', error);
    }
  };

  console.log('ReadingPlanProvider renderizando');

  return (
    <ReadingPlanContext.Provider
      value={{
        currentPlan,
        progress,
        savePlan,
        updateProgress,
        isLoaded,
      }}
    >
      {children}
    </ReadingPlanContext.Provider>
  );
};

export const useReadingPlan = () => {
  const context = useContext(ReadingPlanContext);
  if (context === undefined) {
    console.error('useReadingPlan debe ser usado dentro de un ReadingPlanProvider');
    return { currentPlan: null, progress: {}, savePlan: () => {}, updateProgress: () => {}, isLoaded: true };
  }
  return context;
};