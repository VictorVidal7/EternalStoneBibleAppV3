import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

const lightTheme = {
  background: '#FFFFFF',
  text: '#000000',
  primary: '#007AFF',
  secondary: '#5856D6',
  accent: '#FF9500',
};

const darkTheme = {
  background: '#1C1C1E',
  text: '#FFFFFF',
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  accent: '#FF9F0A',
};

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('isDarkMode');
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  }, []);

  const toggleTheme = useCallback(async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(newTheme));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, [isDarkMode]);

  const theme = React.useMemo(() => ({
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? darkTheme : lightTheme,
  }), [isDarkMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};