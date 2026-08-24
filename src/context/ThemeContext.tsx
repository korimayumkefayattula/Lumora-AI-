import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'focus';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isFocusMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('lumora_theme') as ThemeMode;
    if (saved === 'light' || saved === 'dark' || saved === 'focus') {
      return saved;
    }
    return 'dark'; // default to modern dark
  });

  useEffect(() => {
    localStorage.setItem('lumora_theme', theme);
    const root = document.documentElement;

    // Reset theme classes
    root.classList.remove('light', 'dark', 'theme-focus');

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'focus') {
      root.classList.add('dark', 'theme-focus');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'focus';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isFocusMode: theme === 'focus',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
