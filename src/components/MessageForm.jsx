import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

/**
 * Message form component for users to post new messages
 * 
 * @param {Object} props - Component props
 * @param {string} props.language - Current language (en/ru)
 * @param {Object} props.translations - Translations object
 * @param {Function} props.onSubmit - Handler for message submission
 * @param {Function} props.onInspiration - Handler for inspiration button
 * @param {boolean} props.isAnonymous - Whether to post anonymously
 * @param {Function} props.onToggleAnonymous - Handler for toggling anonymous posting
 */
const MessageForm = ({
  language = 'en',
  translations,
  onSubmit,
  onInspiration,
  isAnonymous = false,
  onToggleAnonymous,
}) => {
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const maxLength = 500;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.length > maxLength) return;
    
    setIsLoading(true);
    try {
      await onSubmit(message, isAnonymous);
      setMessage('');
    } catch (error) {
      console.error('Error posting message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card variant="elevated" className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full rounded-lg border border-border bg-input-background px-4 py-2 text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder={translations.messageForm.placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            maxLength={maxLength}
          />
          <div className="mt-1 flex justify-between text-sm text-text-secondary">
            <span>
              {translations.messageForm.charactersLeft.replace('{count}', maxLength - message.length)}
            </span>
            <button
              type="button"
              className="text-accent hover:underline"
              onClick={onInspiration}
            >
              {translations.messageForm.inspirationButton}
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center space-x-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={() => onToggleAnonymous(!isAnonymous)}
              className="rounded border-border text-accent focus:ring-accent"
            />
            <span>{translations.messageForm.postAnonymously}</span>
          </label>
          
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!message.trim() || message.length > maxLength}
          >
            {translations.messageForm.send}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default MessageForm;
