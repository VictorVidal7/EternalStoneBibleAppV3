import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserPreferencesContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
  const [nightMode, setNightMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('default');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedNightMode = await AsyncStorage.getItem('nightMode');
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      const savedFontFamily = await AsyncStorage.getItem('fontFamily');

      if (savedNightMode !== null) setNightMode(JSON.parse(savedNightMode));
      if (savedFontSize !== null) setFontSize(savedFontSize);
      if (savedFontFamily !== null) setFontFamily(savedFontFamily);

      setIsLoaded(true);
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
      setIsLoaded(true);
    }
  };

  const savePreferences = async (nightMode, fontSize, fontFamily) => {
    try {
      await AsyncStorage.setItem('nightMode', JSON.stringify(nightMode));
      await AsyncStorage.setItem('fontSize', fontSize);
      await AsyncStorage.setItem('fontFamily', fontFamily);
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
    }
  };

  const toggleNightMode = useCallback(() => {
    setNightMode(prevMode => {
      const newMode = !prevMode;
      savePreferences(newMode, fontSize, fontFamily);
      return newMode;
    });
  }, [fontSize, fontFamily]);

  const changeFontSize = useCallback((size) => {
    setFontSize(size);
    savePreferences(nightMode, size, fontFamily);
  }, [nightMode, fontFamily]);

  const changeFontFamily = useCallback((family) => {
    setFontFamily(family);
    savePreferences(nightMode, fontSize, family);
  }, [nightMode, fontSize]);

  return (
    <UserPreferencesContext.Provider
      value={{
        nightMode,
        fontSize,
        fontFamily,
        toggleNightMode,
        changeFontSize,
        changeFontFamily,
        isLoaded,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences debe ser usado dentro de un UserPreferencesProvider');
  }
  return context;
};