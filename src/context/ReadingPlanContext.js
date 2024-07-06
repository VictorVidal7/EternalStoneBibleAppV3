import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReadingPlanContext = createContext();

export const ReadingPlanProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [progress, setProgress] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadReadingPlan();
  }, []);

  const loadReadingPlan = async () => {
    try {
      const savedPlan = await AsyncStorage.getItem('currentReadingPlan');
      const savedProgress = await AsyncStorage.getItem('readingPlanProgress');
      if (savedPlan) setCurrentPlan(JSON.parse(savedPlan));
      if (savedProgress) setProgress(JSON.parse(savedProgress));
      setIsLoaded(true);
    } catch (error) {
      console.error('Error al cargar el plan de lectura:', error);
      setIsLoaded(true);
    }
  };

  const savePlan = async (plan) => {
    try {
      await AsyncStorage.setItem('currentReadingPlan', JSON.stringify(plan));
      setCurrentPlan(plan);
      // Reiniciar el progreso al seleccionar un nuevo plan
      setProgress({});
      await AsyncStorage.setItem('readingPlanProgress', JSON.stringify({}));
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
    throw new Error('useReadingPlan debe ser usado dentro de un ReadingPlanProvider');
  }
  return context;
};