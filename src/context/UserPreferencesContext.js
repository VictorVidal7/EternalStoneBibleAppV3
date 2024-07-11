import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserPreferencesContext = createContext();

export const UserPreferencesProvider = ({ children }) => {
  const [nightMode, setNightMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('default');

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
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      await AsyncStorage.setItem('nightMode', JSON.stringify(nightMode));
      await AsyncStorage.setItem('fontSize', fontSize);
      await AsyncStorage.setItem('fontFamily', fontFamily);
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

  return (
    <UserPreferencesContext.Provider
      value={{
        nightMode,
        fontSize,
        fontFamily,
        toggleNightMode,
        changeFontSize,
        changeFontFamily,
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