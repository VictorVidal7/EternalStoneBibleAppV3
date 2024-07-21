import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useUserPreferences } from './UserPreferencesContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const { nightMode, colorTheme, COLOR_THEMES } = useUserPreferences();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');

  useEffect(() => {
    setIsDarkMode(nightMode);
  }, [nightMode]);

  const theme = useMemo(() => {
    const baseTheme = COLOR_THEMES[colorTheme];
    return {
      isDarkMode,
      colors: {
        ...baseTheme,
        background: isDarkMode ? '#121212' : baseTheme.background,
        text: isDarkMode ? '#FFFFFF' : baseTheme.text,
        card: isDarkMode ? '#1E1E1E' : baseTheme.card,
        primary: isDarkMode ? baseTheme.primary : baseTheme.primary,
        secondary: isDarkMode ? baseTheme.secondary : baseTheme.secondary,
      },
      roundness: 8, // Puedes ajustar este valor según tus preferencias
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