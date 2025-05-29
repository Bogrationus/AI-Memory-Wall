/**
 * Internationalization utilities for AI Memory Wall
 * Handles language detection, switching, and time-based greetings
 */

// Detect browser language and fallback to English if not supported
export function detectLanguage() {
  if (typeof window === 'undefined') return 'en'; // Default for SSR
  
  const browserLang = navigator.language.split('-')[0];
  return ['ru', 'en'].includes(browserLang) ? browserLang : 'en';
}

// Get time-appropriate greeting based on hour and language
export function getTimeBasedGreeting(hour, language = 'en', userType = 'new') {
  // Time-based greeting
  let timeKey = 'morning';
  if (hour >= 12 && hour < 17) timeKey = 'afternoon';
  else if (hour >= 17 && hour < 22) timeKey = 'evening';
  else if (hour >= 22 || hour < 5) timeKey = 'night';
  
  // User type greeting
  let userTypeKey = 'newUser';
  if (userType === 'returning') userTypeKey = 'returningUser';
  else if (userType === 'frequent') userTypeKey = 'frequentUser';
  
  return {
    timeKey,
    userTypeKey
  };
}

// Format date according to locale
export function formatDate(date, language = 'en') {
  return new Date(date).toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format relative time (e.g., "5 minutes ago")
export function formatRelativeTime(date, language = 'en', translations) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  
  if (diff < 60) return translations.time.now;
  
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) {
    return translations.time.minutesAgo.replace('{count}', minutes);
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return translations.time.hoursAgo.replace('{count}', hours);
  }
  
  const days = Math.floor(hours / 24);
  if (days === 1) return translations.time.yesterday;
  
  return translations.time.daysAgo.replace('{count}', days);
}

// Get random inspiration quote
export function getRandomInspiration(translations) {
  const quotes = translations.inspiration.quotes;
  return quotes[Math.floor(Math.random() * quotes.length)];
}
