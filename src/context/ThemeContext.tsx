import React, { createContext, useState, useContext, useEffect, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useUserPreferences } from './UserPreferencesContext';

// Type definitions for theme colors
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  card: string;
  border: string;
  highlight: string;
}

export interface Theme {
  isDarkMode: boolean;
  colors: ThemeColors;
  roundness: number;
}

interface ThemeContextType extends Theme {}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const { nightMode, colorTheme, COLOR_THEMES } = useUserPreferences();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(deviceTheme === 'dark');

  useEffect(() => {
    setIsDarkMode(nightMode);
  }, [nightMode]);

  const theme = useMemo<Theme>(() => {
    const baseTheme = COLOR_THEMES[colorTheme];
    return {
      isDarkMode,
      colors: isDarkMode ? baseTheme.dark : baseTheme.light,
      roundness: 8,
    };
  }, [isDarkMode, colorTheme, COLOR_THEMES]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access the current theme
 * @throws {Error} if used outside of ThemeProvider
 * @returns {ThemeContextType} Current theme object with colors and settings
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
