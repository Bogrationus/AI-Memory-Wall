import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

/**
 * Welcome component for new guests
 * Shows personalized greeting based on time and language
 * 
 * @param {Object} props - Component props
 * @param {string} props.language - Current language (en/ru)
 * @param {Object} props.translations - Translations object
 * @param {Function} props.onContinueAsGuest - Handler for anonymous access
 * @param {Function} props.onSignIn - Handler for sign in
 */
const GuestWelcome = ({
  language = 'en',
  translations,
  onContinueAsGuest,
  onSignIn,
}) => {
  // Get current hour for time-based greeting
  const currentHour = new Date().getHours();
  
  // Determine greeting based on time
  let timeGreeting = translations.greetings.morning;
  if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = translations.greetings.afternoon;
  } else if (currentHour >= 17 && currentHour < 22) {
    timeGreeting = translations.greetings.evening;
  } else if (currentHour >= 22 || currentHour < 5) {
    timeGreeting = translations.greetings.night;
  }
  
  // Get random inspiration quote
  const inspirationQuote = translations.inspiration.quotes[
    Math.floor(Math.random() * translations.inspiration.quotes.length)
  ];
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card variant="elevated" className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-text-primary">
            {translations.app.name}
          </h1>
          <p className="mb-6 text-text-secondary">
            {translations.app.tagline}
          </p>
          
          <div className="mb-8 rounded-xl bg-accent bg-opacity-10 p-4">
            <h2 className="mb-2 text-xl font-medium text-text-primary">
              {timeGreeting}! {translations.greetings.newUser}
            </h2>
            <p className="text-text-secondary">
              {inspirationQuote}
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="primary" 
              fullWidth 
              onClick={() => onSignIn('google')}
            >
              {translations.auth.signInWithGoogle}
            </Button>
            
            <Button 
              variant="secondary" 
              fullWidth 
              onClick={() => onSignIn('github')}
            >
              {translations.auth.signInWithGithub}
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card-background px-2 text-text-secondary">
                  {translations.auth.newHere}
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              fullWidth 
              onClick={onContinueAsGuest}
            >
              {translations.auth.continueAsGuest}
            </Button>
          </div>
        </Card>
        
        <div className="text-center text-sm text-text-tertiary">
          <p>© 2025 AI Memory Wall</p>
          <div className="mt-2 flex justify-center space-x-4">
            <button className="hover:text-accent">
              {language === 'en' ? 'English' : 'Английский'}
            </button>
            <button className="hover:text-accent">
              {language === 'en' ? 'Russian' : 'Русский'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestWelcome;
