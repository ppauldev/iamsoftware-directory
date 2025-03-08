'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

// Get the current theme from localStorage
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';

  const storedTheme = localStorage.getItem('theme') as Theme | null;
  return storedTheme || 'system';
}

// Set the theme in localStorage
export function setStoredTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('theme', theme);
}

// Apply the theme to the document
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  const root = window.document.documentElement;
  const isDark = theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  root.classList.remove('light', 'dark');
  root.classList.add(isDark ? 'dark' : 'light');
}

// Custom hook for theme management
export function useTheme(): {
  theme: Theme;
  setTheme: (theme: Theme) => void;
} {
  const [theme, setThemeState] = useState<Theme>('system');

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
    applyTheme(storedTheme);
  }, []);

  // Update theme when changed
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  };

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return { theme, setTheme };
} 