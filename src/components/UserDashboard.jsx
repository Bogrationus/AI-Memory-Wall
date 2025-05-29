import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import MessageForm from './MessageForm';
import Message from './Message';

/**
 * UserDashboard component for regular users
 * Shows personalized greeting, message form, and message feed
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - User data
 * @param {string} props.language - Current language (en/ru)
 * @param {Object} props.translations - Translations object
 * @param {Array} props.messages - Messages data
 * @param {Function} props.onPostMessage - Handler for posting messages
 * @param {Function} props.onReaction - Handler for reactions
 * @param {Function} props.onSignOut - Handler for sign out
 */
const UserDashboard = ({
  user,
  language = 'en',
  translations,
  messages = [],
  onPostMessage,
  onReaction,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = React.useState('newest');
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [inspirationQuote, setInspirationQuote] = React.useState('');
  
  // Get current hour for time-based greeting
  const currentHour = new Date().getHours();
  
  // Determine greeting based on time and user frequency
  let timeGreeting = translations.greetings.morning;
  if (currentHour >= 12 && currentHour < 17) {
    timeGreeting = translations.greetings.afternoon;
  } else if (currentHour >= 17 && currentHour < 22) {
    timeGreeting = translations.greetings.evening;
  } else if (currentHour >= 22 || currentHour < 5) {
    timeGreeting = translations.greetings.night;
  }
  
  // User type greeting based on frequency
  let userTypeGreeting = translations.greetings.returningUser;
  if (user.frequency_bucket === 'power-user') {
    userTypeGreeting = translations.greetings.frequentUser;
  }
  
  // Get random inspiration quote
  const getRandomInspiration = () => {
    const quotes = translations.inspiration.quotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setInspirationQuote(randomQuote);
  };
  
  // Filter messages based on active tab
  const filteredMessages = React.useMemo(() => {
    switch (activeTab) {
      case 'popular':
        return [...messages].sort((a, b) => {
          const aReactions = a.reactions ? Object.values(a.reactions).reduce((sum, count) => sum + count, 0) : 0;
          const bReactions = b.reactions ? Object.values(b.reactions).reduce((sum, count) => sum + count, 0) : 0;
          return bReactions - aReactions;
        });
      case 'yours':
        return messages.filter(message => message.user_id === user.id);
      case 'recommended':
        // In a real app, this would use AI recommendations
        // For now, just return a mix of popular and recent
        return [...messages].sort((a, b) => {
          const aScore = (a.reactions ? Object.values(a.reactions).reduce((sum, count) => sum + count, 0) : 0) + 
                        (new Date(a.created_at).getTime() / 10000000000);
          const bScore = (b.reactions ? Object.values(b.reactions).reduce((sum, count) => sum + count, 0) : 0) + 
                        (new Date(b.created_at).getTime() / 10000000000);
          return bScore - aScore;
        });
      case 'newest':
      default:
        return [...messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  }, [messages, activeTab, user.id]);
  
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {translations.app.name}
          </h1>
          <p className="text-text-secondary">
            {translations.app.tagline}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* Toggle language */}}
          >
            {language === 'en' ? 'RU' : 'EN'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
          >
            {translations.auth.signOut}
          </Button>
        </div>
      </header>
      
      <Card variant="elevated" className="mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-accent bg-opacity-20">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-accent">
                {user.name?.[0] || 'U'}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-medium text-text-primary">
              {timeGreeting}, {user.name}!
            </h2>
            <p className="text-text-secondary">
              {userTypeGreeting}
            </p>
          </div>
        </div>
      </Card>
      
      <MessageForm
        language={language}
        translations={translations}
        onSubmit={onPostMessage}
        onInspiration={getRandomInspiration}
        isAnonymous={isAnonymous}
        onToggleAnonymous={setIsAnonymous}
      />
      
      {inspirationQuote && (
        <Card variant="bordered" className="mb-6 bg-accent bg-opacity-5">
          <div className="flex items-start gap-2">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-text-primary">{inspirationQuote}</p>
              <button 
                className="mt-2 text-sm text-accent hover:underline"
                onClick={() => setInspirationQuote('')}
              >
                {language === 'en' ? 'Dismiss' : 'Скрыть'}
              </button>
            </div>
          </div>
        </Card>
      )}
      
      <div className="mb-4 flex flex-wrap gap-2">
        {['newest', 'popular', 'yours', 'recommended'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab)}
          >
            {translations.messages[tab]}
          </Button>
        ))}
      </div>
      
      {filteredMessages.length === 0 ? (
        <Card variant="default" className="p-8 text-center">
          <p className="text-text-secondary">{translations.messages.empty}</p>
        </Card>
      ) : (
        <div>
          {filteredMessages.map((message) => (
            <Message
              key={message.id}
              message={message}
              language={language}
              translations={translations}
              onReaction={onReaction}
              isOwner={message.user_id === user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
