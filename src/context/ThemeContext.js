import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserPreferences } from './UserPreferencesContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const { nightMode, colorTheme, COLOR_THEMES } = useUserPreferences();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');

  useEffect(() => {
    setIsDarkMode(nightMode);
  }, [nightMode]);

  const theme = React.useMemo(() => {
    const baseTheme = COLOR_THEMES[colorTheme];
    return {
      isDarkMode,
      colors: {
        ...baseTheme,
        background: isDarkMode ? '#121212' : baseTheme.background,
        text: isDarkMode ? '#FFFFFF' : baseTheme.text,
      },
    };
  }, [isDarkMode, colorTheme, COLOR_THEMES]);

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