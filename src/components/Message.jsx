import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

/**
 * Message component for displaying individual messages
 * 
 * @param {Object} props - Component props
 * @param {Object} props.message - Message data
 * @param {string} props.language - Current language (en/ru)
 * @param {Object} props.translations - Translations object
 * @param {Function} props.onReaction - Handler for reactions
 * @param {boolean} props.isOwner - Whether current user is the message owner
 */
const Message = ({
  message,
  language = 'en',
  translations,
  onReaction,
  isOwner = false,
}) => {
  // Available reactions
  const reactions = [
    { emoji: '👍', name: 'like' },
    { emoji: '❤️', name: 'love' },
    { emoji: '😂', name: 'laugh' },
    { emoji: '😢', name: 'sad' },
    { emoji: '😡', name: 'angry' }
  ];
  
  // Format date according to language
  const formattedDate = new Date(message.created_at).toLocaleDateString(
    language === 'en' ? 'en-US' : 'ru-RU',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  
  // Calculate relative time
  const getRelativeTime = () => {
    const now = new Date();
    const messageDate = new Date(message.created_at);
    const diffInSeconds = Math.floor((now - messageDate) / 1000);
    
    if (diffInSeconds < 60) {
      return translations.time.now;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return translations.time.minutesAgo.replace('{count}', diffInMinutes);
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return translations.time.hoursAgo.replace('{count}', diffInHours);
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return translations.time.yesterday;
    }
    
    return translations.time.daysAgo.replace('{count}', diffInDays);
  };
  
  // Get total reactions count
  const totalReactions = message.reactions ? Object.values(message.reactions).reduce((sum, count) => sum + count, 0) : 0;
  
  return (
    <Card 
      variant={isOwner ? "bordered" : "default"} 
      className={`mb-4 ${isOwner ? 'border-accent border-opacity-50' : ''}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 overflow-hidden rounded-full bg-accent bg-opacity-20">
            {message.user?.avatar ? (
              <img 
                src={message.user.avatar} 
                alt={message.user.name || translations.messages.anonymous} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-accent">
                {message.anonymous ? 'A' : message.user?.name?.[0] || 'U'}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-text-primary">
              {message.anonymous 
                ? translations.messages.anonymous 
                : message.user?.name || translations.messages.anonymous}
            </p>
            <p className="text-xs text-text-tertiary">
              {getRelativeTime()}
            </p>
          </div>
        </div>
        
        {isOwner && (
          <div className="rounded-full bg-accent bg-opacity-10 px-2 py-0.5 text-xs text-accent">
            {translations.messages.yours}
          </div>
        )}
      </div>
      
      <div className="mb-4 whitespace-pre-wrap text-text-primary">
        {message.content}
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {reactions.map((reaction) => (
            <button
              key={reaction.name}
              onClick={() => onReaction(message.id, reaction.name)}
              className={`rounded-full px-2 py-1 text-sm transition-colors ${
                message.userReactions?.includes(reaction.name)
                  ? 'bg-accent text-button-text'
                  : 'bg-card-background hover:bg-accent hover:bg-opacity-10'
              }`}
            >
              {reaction.emoji} {message.reactions?.[reaction.name] || 0}
            </button>
          ))}
        </div>
        
        <div className="text-xs text-text-tertiary">
          {translations.messages.postedOn.replace('{date}', formattedDate)}
        </div>
      </div>
      
      {totalReactions > 0 && (
        <div className="mt-2 text-xs text-text-secondary">
          {translations.reactions.reactionsCount.replace('{count}', totalReactions)}
        </div>
      )}
    </Card>
  );
};

export default Message;
