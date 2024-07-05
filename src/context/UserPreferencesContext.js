import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
      const preferences = await AsyncStorage.getItem('userPreferences');
      if (preferences) {
        const { nightMode, fontSize, fontFamily } = JSON.parse(preferences);
        setNightMode(nightMode);
        setFontSize(fontSize);
        setFontFamily(fontFamily);
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const savePreferences = useCallback(async () => {
    try {
      const preferences = JSON.stringify({ nightMode, fontSize, fontFamily });
      await AsyncStorage.setItem('userPreferences', preferences);
    } catch (error) {
      console.error('Error saving user preferences:', error);
    }
  }, [nightMode, fontSize, fontFamily]);

  const toggleNightMode = useCallback(() => {
    setNightMode(prev => !prev);
  }, []);

  const changeFontSize = useCallback((size) => {
    setFontSize(size);
  }, []);

  const changeFontFamily = useCallback((family) => {
    setFontFamily(family);
  }, []);

  useEffect(() => {
    savePreferences();
  }, [nightMode, fontSize, fontFamily, savePreferences]);

  return (
    <UserPreferencesContext.Provider value={{
      nightMode,
      fontSize,
      fontFamily,
      toggleNightMode,
      changeFontSize,
      changeFontFamily
    }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => useContext(UserPreferencesContext);