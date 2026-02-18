/**
 * Theme Context for Swiss Style Design System
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { theme, ThemeContextType } from '../theme';

const ThemeContext = createContext<ThemeContextType>({
  theme,
  isDark: false,
});

interface ThemeProviderProps {
  children: ReactNode;
  isDark?: boolean;
}

/**
 * Theme Provider for Swiss Style design system
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  isDark = false,
}) => {
  const currentTheme = theme;

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use the theme
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * Hook to get specific theme values
 */
export const useColors = () => useTheme().theme.colors;
export const useTypography = () => useTheme().theme.typography;
export const useSpacing = () => useTheme().theme.spacing;