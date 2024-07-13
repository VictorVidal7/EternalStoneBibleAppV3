import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserPreferencesContext = createContext();

const DEFAULT_PREFERENCES = {
  nightMode: false,
  fontSize: 'medium',
  fontFamily: 'default',
  lineSpacing: '1.5',
};

export const UserPreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = useCallback(async () => {
    try {
      const savedPreferences = await AsyncStorage.getItem('userPreferences');
      if (savedPreferences !== null) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      // Optionally, you could set an error state here and show it to the user
    }
  }, []);

  const savePreferences = useCallback(async (newPreferences) => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Optionally, you could set an error state here and show it to the user
    }
  }, []);

  const updatePreference = useCallback((key, value) => {
    savePreferences({ ...preferences, [key]: value });
  }, [preferences, savePreferences]);

  const toggleNightMode = useCallback(() => {
    updatePreference('nightMode', !preferences.nightMode);
  }, [preferences.nightMode, updatePreference]);

  const changeFontSize = useCallback((size) => {
    updatePreference('fontSize', size);
  }, [updatePreference]);

  const changeFontFamily = useCallback((family) => {
    updatePreference('fontFamily', family);
  }, [updatePreference]);

  const changeLineSpacing = useCallback((spacing) => {
    updatePreference('lineSpacing', spacing);
  }, [updatePreference]);

  const resetPreferences = useCallback(() => {
    savePreferences(DEFAULT_PREFERENCES);
  }, [savePreferences]);

  return (
    <UserPreferencesContext.Provider
      value={{
        ...preferences,
        toggleNightMode,
        changeFontSize,
        changeFontFamily,
        changeLineSpacing,
        resetPreferences,
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