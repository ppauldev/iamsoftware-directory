'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { applyTheme } from '@/lib/theme-utils';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  attribute?: string;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  enableSystem = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  attribute = 'data-theme',
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    } else {
      setThemeState(defaultTheme);
      applyTheme(defaultTheme);
    }
  }, [defaultTheme]);

  const setTheme = (theme: Theme) => {
    localStorage.setItem('theme', theme);

    // Disable transitions
    if (disableTransitionOnChange) {
      document.documentElement.classList.add('disable-transitions');
    }

    setThemeState(theme);
    applyTheme(theme);

    // Re-enable transitions
    if (disableTransitionOnChange) {
      // Force reflow
      void document.documentElement.offsetHeight;
      document.documentElement.classList.remove('disable-transitions');
    }
  };

  // Listen for system preference changes
  useEffect(() => {
    if (!enableSystem) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, enableSystem]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}; 