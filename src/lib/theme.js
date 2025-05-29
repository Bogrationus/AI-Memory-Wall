/**
 * Theme utilities for AI Memory Wall
 * Handles theme detection, switching, and CSS variables
 */

// Detect user preferred theme
export function detectTheme() {
  if (typeof window === 'undefined') return 'dark'; // Default for SSR
  
  // Check user preference in localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && ['dark', 'light', 'auto'].includes(savedTheme)) {
    return savedTheme;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
}

// Apply theme to document
export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  const actualTheme = theme === 'auto' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  
  if (actualTheme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    setDarkThemeColors();
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    setLightThemeColors();
  }
}

// Set CSS variables for dark theme
function setDarkThemeColors() {
  const root = document.documentElement;
  
  // Base colors
  root.style.setProperty('--background', '#121212');
  root.style.setProperty('--foreground', '#ffffff');
  root.style.setProperty('--card-background', '#1e1e1e');
  root.style.setProperty('--accent', '#00E0FF');
  root.style.setProperty('--accent-hover', '#33e6ff');
  root.style.setProperty('--accent-shadow', '#00e0ff33');
  
  // UI elements
  root.style.setProperty('--border', '#333333');
  root.style.setProperty('--input-background', '#2a2a2a');
  root.style.setProperty('--button-text', '#121212');
  
  // Text colors
  root.style.setProperty('--text-primary', '#ffffff');
  root.style.setProperty('--text-secondary', '#a0a0a0');
  root.style.setProperty('--text-tertiary', '#6a6a6a');
  
  // Status colors
  root.style.setProperty('--success', '#4ade80');
  root.style.setProperty('--warning', '#fbbf24');
  root.style.setProperty('--error', '#f87171');
  root.style.setProperty('--info', '#60a5fa');
}

// Set CSS variables for light theme
function setLightThemeColors() {
  const root = document.documentElement;
  
  // Base colors
  root.style.setProperty('--background', '#f8f8f8');
  root.style.setProperty('--foreground', '#121212');
  root.style.setProperty('--card-background', '#ffffff');
  root.style.setProperty('--accent', '#0090a3');
  root.style.setProperty('--accent-hover', '#007a8a');
  root.style.setProperty('--accent-shadow', '#0090a333');
  
  // UI elements
  root.style.setProperty('--border', '#e0e0e0');
  root.style.setProperty('--input-background', '#f0f0f0');
  root.style.setProperty('--button-text', '#ffffff');
  
  // Text colors
  root.style.setProperty('--text-primary', '#121212');
  root.style.setProperty('--text-secondary', '#5a5a5a');
  root.style.setProperty('--text-tertiary', '#8a8a8a');
  
  // Status colors
  root.style.setProperty('--success', '#22c55e');
  root.style.setProperty('--warning', '#f59e0b');
  root.style.setProperty('--error', '#ef4444');
  root.style.setProperty('--info', '#3b82f6');
}

// Listen for system theme changes
export function setupThemeListener(callback) {
  if (typeof window === 'undefined') return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', callback);
  
  return () => mediaQuery.removeEventListener('change', callback);
}
