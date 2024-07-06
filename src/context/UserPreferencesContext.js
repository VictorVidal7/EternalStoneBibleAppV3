import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserPreferencesContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
  console.log('UserPreferencesProvider iniciado');
  const [nightMode, setNightMode] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Cambiado a un número por defecto
  const [fontFamily, setFontFamily] = useState('default');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      console.log('Cargando preferencias...');
      const savedNightMode = await AsyncStorage.getItem('nightMode');
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      const savedFontFamily = await AsyncStorage.getItem('fontFamily');

      if (savedNightMode !== null) setNightMode(JSON.parse(savedNightMode));
      if (savedFontSize !== null) setFontSize(getFontSizeNumber(savedFontSize));
      if (savedFontFamily !== null) setFontFamily(savedFontFamily);

      console.log('Preferencias cargadas:', { nightMode, fontSize, fontFamily });
      setIsLoaded(true);
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
      setIsLoaded(true);
    }
  };

  const savePreferences = async (nightMode, fontSize, fontFamily) => {
    try {
      await AsyncStorage.setItem('nightMode', JSON.stringify(nightMode));
      await AsyncStorage.setItem('fontSize', fontSize.toString());
      await AsyncStorage.setItem('fontFamily', fontFamily);
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
    }
  };

  const toggleNightMode = () => {
    setNightMode(prevMode => !prevMode);
    savePreferences(!nightMode, fontSize, fontFamily);
  };

  const getFontSizeNumber = (size) => {
    if (typeof size === 'number') return size;
    switch(size) {
      case 'small': return 14;
      case 'medium': return 16;
      case 'large': return 18;
      default: return 16;
    }
  };

  const changeFontSize = (size) => {
    const numericSize = getFontSizeNumber(size);
    setFontSize(numericSize);
    savePreferences(nightMode, numericSize, fontFamily);
  };

  const changeFontFamily = (family) => {
    setFontFamily(family);
    savePreferences(nightMode, fontSize, family);
  };

  console.log('UserPreferencesProvider renderizando');

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
    console.error('useUserPreferences debe ser usado dentro de un UserPreferencesProvider');
    return { nightMode: false, fontSize: 16, fontFamily: 'default', isLoaded: true };
  }
  return context;
};