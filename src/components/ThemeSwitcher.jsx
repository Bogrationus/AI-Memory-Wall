import React from 'react';
import { detectTheme, applyTheme, setupThemeListener } from '../lib/theme';
import Button from './ui/Button';

/**
 * ThemeSwitcher component for toggling between light and dark themes
 * 
 * @param {Object} props - Component props
 * @param {string} props.language - Current language (en/ru)
 * @param {Object} props.translations - Translations object
 * @param {Function} props.onThemeChange - Handler for theme change
 */
const ThemeSwitcher = ({
  language = 'en',
  translations,
  onThemeChange,
}) => {
  const [theme, setTheme] = React.useState('auto');
  
  // Initialize theme on component mount
  React.useEffect(() => {
    const currentTheme = detectTheme();
    setTheme(currentTheme);
    applyTheme(currentTheme);
    
    // Set up listener for system theme changes
    const cleanup = setupThemeListener(() => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    });
    
    return cleanup;
  }, []);
  
  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
    
    // Save theme preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };
  
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border p-1">
      <Button
        variant={theme === 'light' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleThemeChange('light')}
        aria-label={translations.settings.light}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </Button>
      
      <Button
        variant={theme === 'dark' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleThemeChange('dark')}
        aria-label={translations.settings.dark}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </Button>
      
      <Button
        variant={theme === 'auto' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleThemeChange('auto')}
        aria-label={translations.settings.auto}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 5v2"></path>
          <path d="M12 17v2"></path>
          <path d="m17 12 2 0"></path>
          <path d="M5 12 7 12"></path>
          <path d="m16 7-1.4 1.4"></path>
          <path d="M9.4 15.6 8 17"></path>
          <path d="m16 17-1.4-1.4"></path>
          <path d="M9.4 8.4 8 7"></path>
        </svg>
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
