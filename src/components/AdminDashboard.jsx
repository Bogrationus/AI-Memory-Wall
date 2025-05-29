import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';

/**
 * AdminDashboard component for administrators
 * Shows moderation tools, user management, analytics, and settings
 * 
 * @param {Object} props - Component props
 * @param {Object} props.user - Admin user data
 * @param {string} props.language - Current language (en/ru)
 * @param {Object} props.translations - Translations object
 * @param {Array} props.messages - Messages data
 * @param {Array} props.users - Users data
 * @param {Object} props.analytics - Analytics data
 * @param {Function} props.onHideMessage - Handler for hiding messages
 * @param {Function} props.onUnhideMessage - Handler for unhiding messages
 * @param {Function} props.onBanUser - Handler for banning users
 * @param {Function} props.onUnbanUser - Handler for unbanning users
 * @param {Function} props.onSetModerator - Handler for setting moderator role
 * @param {Function} props.onRemoveModerator - Handler for removing moderator role
 * @param {Function} props.onUpdateSettings - Handler for updating settings
 * @param {Function} props.onSignOut - Handler for sign out
 */
const AdminDashboard = ({
  user,
  language = 'en',
  translations,
  messages = [],
  users = [],
  analytics = {},
  onHideMessage,
  onUnhideMessage,
  onBanUser,
  onUnbanUser,
  onSetModerator,
  onRemoveModerator,
  onUpdateSettings,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [toxicityThreshold, setToxicityThreshold] = React.useState(0.7);
  const [hiddenReason, setHiddenReason] = React.useState('');
  
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
  
  // Filter messages that need moderation (high toxicity score)
  const moderationQueue = React.useMemo(() => {
    return messages
      .filter(message => message.toxicity_score > toxicityThreshold && !message.hidden)
      .sort((a, b) => b.toxicity_score - a.toxicity_score);
  }, [messages, toxicityThreshold]);
  
  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Card variant="elevated">
              <h3 className="mb-4 text-lg font-medium text-text-primary">
                {translations.analytics.weeklyReport}
              </h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="rounded-lg bg-accent bg-opacity-10 p-3 text-center">
                  <p className="text-sm text-text-secondary">{translations.analytics.messageCount}</p>
                  <p className="text-2xl font-bold text-accent">{analytics.messageCount || 0}</p>
                </div>
                
                <div className="rounded-lg bg-accent bg-opacity-10 p-3 text-center">
                  <p className="text-sm text-text-secondary">{translations.analytics.userActivity}</p>
                  <p className="text-2xl font-bold text-accent">{analytics.activeUsers || 0}</p>
                </div>
                
                <div className="rounded-lg bg-accent bg-opacity-10 p-3 text-center">
                  <p className="text-sm text-text-secondary">{translations.analytics.toxicityLevels}</p>
                  <p className="text-2xl font-bold text-accent">{(analytics.avgToxicity || 0).toFixed(2)}</p>
                </div>
                
                <div className="rounded-lg bg-accent bg-opacity-10 p-3 text-center">
                  <p className="text-sm text-text-secondary">{translations.analytics.reactionDistribution}</p>
                  <p className="text-2xl font-bold text-accent">{analytics.totalReactions || 0}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="mb-2 font-medium text-text-primary">{translations.analytics.topWords}</p>
                <div className="flex flex-wrap gap-2">
                  {(analytics.topWords || []).map((word, index) => (
                    <span 
                      key={index} 
                      className="rounded-full bg-card-background px-3 py-1 text-sm text-text-secondary"
                    >
                      {word.text} ({word.count})
                    </span>
                  ))}
                </div>
              </div>
            </Card>
            
            <Card variant="elevated">
              <h3 className="mb-4 text-lg font-medium text-text-primary">
                {translations.admin.moderationQueue}
              </h3>
              
              {moderationQueue.length === 0 ? (
                <p className="text-text-secondary">No messages requiring moderation.</p>
              ) : (
                <div className="space-y-4">
                  {moderationQueue.map(message => (
                    <div key={message.id} className="rounded-lg border border-border p-3">
                      <div className="mb-2 flex justify-between">
                        <span className="font-medium text-text-primary">
                          {message.user?.name || translations.messages.anonymous}
                        </span>
                        <span className="text-sm text-error">
                          Toxicity: {message.toxicity_score.toFixed(2)}
                        </span>
                      </div>
                      
                      <p className="mb-3 text-text-primary">{message.content}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Input
                          placeholder={translations.admin.hiddenReason}
                          value={hiddenReason}
                          onChange={(e) => setHiddenReason(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            onHideMessage(message.id, hiddenReason);
                            setHiddenReason('');
                          }}
                        >
                          {translations.admin.hideMessage}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        );
        
      case 'messages':
        return (
          <Card variant="elevated">
            <h3 className="mb-4 text-lg font-medium text-text-primary">
              {translations.admin.messages}
            </h3>
            
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`rounded-lg border p-3 ${message.hidden ? 'border-error bg-error bg-opacity-5' : 'border-border'}`}
                >
                  <div className="mb-2 flex justify-between">
                    <span className="font-medium text-text-primary">
                      {message.user?.name || translations.messages.anonymous}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {new Date(message.created_at).toLocaleDateString(
                        language === 'en' ? 'en-US' : 'ru-RU'
                      )}
                    </span>
                  </div>
                  
                  <p className="mb-3 text-text-primary">{message.content}</p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-text-secondary">
                        Toxicity: {message.toxicity_score.toFixed(2)}
                      </span>
                      
                      {message.hidden && (
                        <span className="text-sm text-error">
                          {translations.admin.hiddenReason}: {message.hidden_reason || 'N/A'}
                        </span>
                      )}
                    </div>
                    
                    <Button
                      variant={message.hidden ? 'outline' : 'primary'}
                      size="sm"
                      onClick={() => message.hidden ? onUnhideMessage(message.id) : onHideMessage(message.id, hiddenReason)}
                    >
                      {message.hidden ? translations.admin.unhideMessage : translations.admin.hideMessage}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
        
      case 'users':
        return (
          <Card variant="elevated">
            <h3 className="mb-4 text-lg font-medium text-text-primary">
              {translations.admin.users}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-left text-text-primary">ID</th>
                    <th className="px-4 py-2 text-left text-text-primary">Name</th>
                    <th className="px-4 py-2 text-left text-text-primary">Email</th>
                    <th className="px-4 py-2 text-left text-text-primary">Role</th>
                    <th className="px-4 py-2 text-left text-text-primary">Status</th>
                    <th className="px-4 py-2 text-left text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-border">
                      <td className="px-4 py-2 text-text-secondary">{user.id.substring(0, 8)}...</td>
                      <td className="px-4 py-2 text-text-primary">{user.name || 'Anonymous'}</td>
                      <td className="px-4 py-2 text-text-secondary">{user.email || 'N/A'}</td>
                      <td className="px-4 py-2 text-text-secondary">{user.role}</td>
                      <td className="px-4 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${
                          user.banned 
                            ? 'bg-error bg-opacity-20 text-error' 
                            : 'bg-success bg-opacity-20 text-success'
                        }`}>
                          {user.banned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          <Button
                            variant={user.banned ? 'outline' : 'primary'}
                            size="sm"
                            onClick={() => user.banned ? onUnbanUser(user.id) : onBanUser(user.id)}
                          >
                            {user.banned ? translations.admin.unbanUser : translations.admin.banUser}
                          </Button>
                          
                          {user.role !== 'admin' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => user.role === 'moderator' 
                                ? onRemoveModerator(user.id) 
                                : onSetModerator(user.id)
                              }
                            >
                              {user.role === 'moderator' 
                                ? translations.admin.removeModerator 
                                : translations.admin.setModerator
                              }
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        );
        
      case 'settings':
        return (
          <Card variant="elevated">
            <h3 className="mb-4 text-lg font-medium text-text-primary">
              {translations.admin.settings}
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 font-medium text-text-primary">
                  {translations.admin.toxicityThreshold}
                </h4>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={toxicityThreshold}
                    onChange={(e) => setToxicityThreshold(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-text-primary">{toxicityThreshold.toFixed(2)}</span>
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {language === 'en' 
                    ? 'Messages with toxicity score above this threshold will be flagged for moderation.'
                    : 'Сообщения с уровнем токсичности выше этого порога будут отмечены для модерации.'
                  }
                </p>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-text-primary">
                  {translations.admin.telegramSettings}
                </h4>
                <Input
                  label="Webhook URL"
                  placeholder="https://api.telegram.org/bot<token>/setWebhook"
                  className="mb-2"
                />
                <Button
                  variant="primary"
                >
                  {language === 'en' ? 'Update Webhook' : 'Обновить вебхук'}
                </Button>
              </div>
              
              <div>
                <h4 className="mb-2 font-medium text-text-primary">
                  {translations.admin.analyticsSettings}
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableWeeklyReport"
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <label htmlFor="enableWeeklyReport" className="text-text-primary">
                    {language === 'en' ? 'Enable weekly analytics report' : 'Включить еженедельный аналитический отчет'}
                  </label>
                </div>
              </div>
              
              <Button
                variant="primary"
                onClick={() => onUpdateSettings({ toxicityThreshold })}
              >
                {translations.settings.save}
              </Button>
            </div>
          </Card>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto max-w-6xl p-4">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {translations.app.name} - {translations.admin.dashboard}
          </h1>
          <p className="text-text-secondary">
            {timeGreeting}, {user.name}!
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
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
        <div className="space-y-2">
          {['dashboard', 'messages', 'users', 'settings'].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'primary' : 'ghost'}
              fullWidth
              onClick={() => setActiveTab(tab)}
            >
              {translations.admin[tab]}
            </Button>
          ))}
          
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="secondary"
              fullWidth
            >
              {translations.admin.exportData}
            </Button>
          </div>
        </div>
        
        <div>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
