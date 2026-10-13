import React, { createContext, useContext, useState, useEffect } from 'react';
import { AestheticThemeId, ThemeMode, THEMES, AestheticTheme } from '../types/theme';

interface ThemeContextType {
  themeId: AestheticThemeId;
  mode: ThemeMode;
  theme: AestheticTheme;
  setThemeId: (id: AestheticThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  activeTokens: AestheticTheme['light'] | AestheticTheme['dark'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'velours_active_theme';
const MODE_STORAGE_KEY = 'velours_active_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<AestheticThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as AestheticThemeId;
      return saved && THEMES[saved] ? saved : 'coquette';
    } catch {
      return 'coquette';
    }
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode;
      return saved === 'dark' || saved === 'light' ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeId);
    } catch {
      // Ignore storage errors
    }
  }, [themeId]);

  useEffect(() => {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, mode);
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Ignore storage errors
    }
  }, [mode]);

  const setThemeId = (id: AestheticThemeId) => {
    setThemeIdState(id);
  };

  const setMode = (m: ThemeMode) => {
    setModeState(m);
  };

  const toggleMode = () => {
    setModeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = THEMES[themeId];
  const activeTokens = mode === 'light' ? theme.light : theme.dark;

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        mode,
        theme,
        setThemeId,
        setMode,
        toggleMode,
        activeTokens
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
