// Switcher.tsx
'use client';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import { Select } from '../SettingsDialog';

type Theme = 'dark' | 'light' | 'system';

interface ThemeSwitcherProps {
  className?: string;
  size?: number; // Add the size prop here
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className, size }) => {
  const [mounted, setMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  const isTheme = useCallback((t: Theme) => t === theme, [theme]);

  const handleThemeSwitch = (theme: Theme) => {
    setTheme(theme);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isTheme('system')) {
      const preferDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

      const detectThemeChange = (event: MediaQueryListEvent) => {
        const theme: Theme = event.matches ? 'dark' : 'light';
        setTheme(theme);
      };

      preferDarkScheme.addEventListener('change', detectThemeChange);

      return () => {
        preferDarkScheme.removeEventListener('change', detectThemeChange);
      };
    }
  }, [isTheme, setTheme, theme]);

  // Avoid Hydration Mismatch
  if (!mounted) {
    return null;
  }

  const selectStyle = size ? { fontSize: size } : {}; // Apply the size to the Select component if provided

  return (
    <Select
      className={className}
      style={selectStyle} // Pass the style here
      value={theme}
      onChange={(e) => handleThemeSwitch(e.target.value as Theme)}
      options={[
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' }
      ]}
    />
  );
};


export default ThemeSwitcher;
