import React from 'react';
import Button from './ui/Button';

/**
 * LanguageSwitcher component for toggling between languages
 * 
 * @param {Object} props - Component props
 * @param {string} props.language - Current language (en/ru)
 * @param {Function} props.onLanguageChange - Handler for language change
 */
const LanguageSwitcher = ({
  language = 'en',
  onLanguageChange,
}) => {
  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
    
    // Save language preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('language', newLanguage);
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === 'en' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleLanguageChange('en')}
        aria-label="English"
      >
        EN
      </Button>
      
      <Button
        variant={language === 'ru' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => handleLanguageChange('ru')}
        aria-label="Русский"
      >
        RU
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
