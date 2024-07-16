import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserPreferencesContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
  const [nightMode, setNightMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('default');
  const [lineSpacing, setLineSpacing] = useState('1.5');
  const [textZoom, setTextZoom] = useState(100);
  const [accentColor, setAccentColor] = useState('#007AFF');

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
        setAccentColor(prefs.accentColor);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      const preferences = { nightMode, fontSize, fontFamily, lineSpacing, textZoom, accentColor };
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

  const changeAccentColor = (color) => {
    setAccentColor(color);
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
        accentColor,
        toggleNightMode,
        changeFontSize,
        changeFontFamily,
        changeLineSpacing,
        changeTextZoom,
        changeAccentColor,
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