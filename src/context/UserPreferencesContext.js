import React, { createContext, useState, useContext, useEffect } from 'react';
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

  const toggleNightMode = () => {
    setNightMode(prevMode => !prevMode);
    savePreferences(!nightMode, fontSize, fontFamily);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    savePreferences(nightMode, size, fontFamily);
  };

  const changeFontFamily = (family) => {
    setFontFamily(family);
    savePreferences(nightMode, fontSize, family);
  };

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