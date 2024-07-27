import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserPreferencesContext = createContext();

export const COLOR_THEMES = {
  default: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#FFFFFF',
    text: '#000000',
    card: '#F2F2F7',
    border: '#C7C7CC',
    highlight: '#FFFF00',
  },
  dark: {
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    background: '#000000',
    text: '#FFFFFF',
    card: '#1C1C1E',
    border: '#38383A',
    highlight: '#FFFF00',
  },
  // Puedes añadir más temas aquí
};

export const UserPreferencesProvider = ({ children }) => {
  const [nightMode, setNightMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('default');
  const [lineSpacing, setLineSpacing] = useState(1.5);
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
        setFontSize(Number(prefs.fontSize) || 16);
        setFontFamily(prefs.fontFamily);
        setLineSpacing(Number(prefs.lineSpacing) || 1.5);
        setTextZoom(prefs.textZoom);
        setColorTheme(prefs.colorTheme || 'default');
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async (preferences) => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const toggleNightMode = useCallback(() => {
    setNightMode(prev => {
      const newValue = !prev;
      savePreferences({ ...getCurrentPreferences(), nightMode: newValue });
      return newValue;
    });
  }, []);

  const changeFontSize = useCallback((size) => {
    const newSize = Number(size);
    if (!isNaN(newSize)) {
      setFontSize(newSize);
      savePreferences({ ...getCurrentPreferences(), fontSize: newSize });
    } else {
      console.error('Invalid font size:', size);
    }
  }, []);

  const changeFontFamily = useCallback((family) => {
    setFontFamily(family);
    savePreferences({ ...getCurrentPreferences(), fontFamily: family });
  }, []);

  const changeLineSpacing = useCallback((spacing) => {
    const newSpacing = Number(spacing);
    if (!isNaN(newSpacing)) {
      setLineSpacing(newSpacing);
      savePreferences({ ...getCurrentPreferences(), lineSpacing: newSpacing });
    } else {
      console.error('Invalid line spacing:', spacing);
    }
  }, []);

  const changeTextZoom = useCallback((zoom) => {
    setTextZoom(zoom);
    savePreferences({ ...getCurrentPreferences(), textZoom: zoom });
  }, []);

  const changeColorTheme = useCallback((theme) => {
    setColorTheme(theme);
    savePreferences({ ...getCurrentPreferences(), colorTheme: theme });
  }, []);

  const getCurrentPreferences = () => ({
    nightMode,
    fontSize,
    fontFamily,
    lineSpacing,
    textZoom,
    colorTheme,
  });

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