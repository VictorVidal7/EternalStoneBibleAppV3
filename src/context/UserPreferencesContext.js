import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserPreferencesContext = createContext();

const COLOR_THEMES = {
  default: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
  },
  nature: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    background: '#F1F8E9',
    text: '#33691E',
  },
  ocean: {
    primary: '#0288D1',
    secondary: '#03A9F4',
    background: '#E1F5FE',
    text: '#01579B',
  },
  // Puedes añadir más temas aquí
};

export const UserPreferencesProvider = ({ children }) => {
  const [nightMode, setNightMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('default');
  const [lineSpacing, setLineSpacing] = useState('1.5');
  const [textZoom, setTextZoom] = useState(100);
  const [colorTheme, setColorTheme] = useState('default');

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const savedPreferences = await AsyncStorage.getItem('userPreferences');
      if (savedPreferences !== null) {
        const prefs = JSON.parse(savedPreferences);
        setNightMode(prefs.nightMode);
        setFontSize(prefs.fontSize);
        setFontFamily(prefs.fontFamily);
        setLineSpacing(prefs.lineSpacing);
        setTextZoom(prefs.textZoom);
        setColorTheme(prefs.colorTheme || 'default');
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      const preferences = { nightMode, fontSize, fontFamily, lineSpacing, textZoom, colorTheme };
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const toggleNightMode = () => {
    setNightMode(prev => !prev);
    savePreferences();
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    savePreferences();
  };

  const changeFontFamily = (family) => {
    setFontFamily(family);
    savePreferences();
  };

  const changeLineSpacing = (spacing) => {
    setLineSpacing(spacing);
    savePreferences();
  };

  const changeTextZoom = (zoom) => {
    setTextZoom(zoom);
    savePreferences();
  };

  const changeColorTheme = (theme) => {
    setColorTheme(theme);
    savePreferences();
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        nightMode,
        fontSize,
        fontFamily,
        lineSpacing,
        textZoom,
        colorTheme,
        toggleNightMode,
        changeFontSize,
        changeFontFamily,
        changeLineSpacing,
        changeTextZoom,
        changeColorTheme,
        COLOR_THEMES,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};