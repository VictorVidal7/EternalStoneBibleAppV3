import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReadingProgressContext = createContext();

export const ReadingProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('readingProgress');
      if (savedProgress !== null) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading reading progress:', error);
    }
  };

  const saveProgress = async (newProgress) => {
    try {
      await AsyncStorage.setItem('readingProgress', JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  };

  const updateChapterProgress = (book, chapter, percentage) => {
    const newProgress = {
      ...progress,
      [book]: {
        ...progress[book],
        [chapter]: percentage
      }
    };
    saveProgress(newProgress);
  };

  const getChapterProgress = (book, chapter) => {
    return progress[book]?.[chapter] || 0;
  };

  return (
    <ReadingProgressContext.Provider
      value={{
        progress,
        updateChapterProgress,
        getChapterProgress
      }}
    >
      {children}
    </ReadingProgressContext.Provider>
  );
};

export const useReadingProgress = () => {
  const context = useContext(ReadingProgressContext);
  if (context === undefined) {
    throw new Error('useReadingProgress must be used within a ReadingProgressProvider');
  }
  return context;
};