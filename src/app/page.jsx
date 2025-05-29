'use client';

import React, { useState, useEffect } from 'react';
import { detectLanguage } from '../lib/i18n';
import { detectTheme, applyTheme } from '../lib/theme';
import GuestWelcome from '../components/GuestWelcome';
import UserDashboard from '../components/UserDashboard';
import AdminDashboard from '../components/AdminDashboard';
import api from '../lib/api';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userMeta, setUserMeta] = useState(null);
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [analytics, setAnalytics] = useState({});

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        // Detect language
        const detectedLang = detectLanguage();
        setLanguage(detectedLang);
        
        // Load translations
        const translationsModule = await import(`../locales/${detectedLang}/common.json`);
        setTranslations(translationsModule.default);
        
        // Apply theme
        const theme = detectTheme();
        applyTheme(theme);
        
        // Check for authenticated user
        const currentUser = await api.auth.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
          
          // Get user metadata
          const metadata = await api.auth.getUserMetadata(currentUser.id);
          setUserMeta(metadata);
          
          // Load messages
          const allMessages = await api.messages.getAllMessages();
          setMessages(allMessages);
          
          // Load analytics if admin
          if (currentUser.role === 'admin') {
            const analyticsData = await api.analytics.getWeeklyAnalytics();
            setAnalytics(analyticsData);
          }
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initApp();
  }, []);
  
  // Handle sign in
  const handleSignIn = async (provider) => {
    try {
      setLoading(true);
      const user = await api.auth.signInWithProvider(provider);
      setUser(user);
      
      // Get user metadata
      const metadata = await api.auth.getUserMetadata(user.id);
      setUserMeta(metadata);
      
      // Load messages
      const allMessages = await api.messages.getAllMessages();
      setMessages(allMessages);
      
      // Load analytics if admin
      if (user.role === 'admin') {
        const analyticsData = await api.analytics.getWeeklyAnalytics();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle anonymous sign in
  const handleContinueAsGuest = async () => {
    try {
      setLoading(true);
      const user = await api.auth.signInAnonymously();
      setUser(user);
      
      // Get user metadata
      const metadata = await api.auth.getUserMetadata(user.id);
      setUserMeta(metadata);
      
      // Load messages
      const allMessages = await api.messages.getAllMessages();
      setMessages(allMessages);
    } catch (error) {
      console.error('Error signing in as guest:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      setLoading(true);
      await api.auth.signOut();
      setUser(null);
      setUserMeta(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle language change
  const handleLanguageChange = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      
      // Load translations
      const translationsModule = await import(`../locales/${newLanguage}/common.json`);
      setTranslations(translationsModule.default);
      
      // Update user metadata if authenticated
      if (user && userMeta) {
        await api.auth.updateUserMetadata(user.id, { language: newLanguage });
        setUserMeta({ ...userMeta, language: newLanguage });
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };
  
  // Handle post message
  const handlePostMessage = async (content, isAnonymous) => {
    try {
      if (!user) return;
      
      const newMessage = await api.messages.createMessage(content, user.id, isAnonymous);
      
      // Refresh messages
      const allMessages = await api.messages.getAllMessages();
      setMessages(allMessages);
      
      return newMessage;
    } catch (error) {
      console.error('Error posting message:', error);
      throw error;
    }
  };
  
  // Handle reaction
  const handleReaction = async (messageId, emoji) => {
    try {
      if (!user) return;
      
      await api.messages.addReaction(messageId, user.id, emoji);
      
      // Refresh messages
      const allMessages = await api.messages.getAllMessages();
      setMessages(allMessages);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };
  
  // Handle hide message (admin only)
  const handleHideMessage = async (messageId, reason) => {
    try {
      if (!user || user.role !== 'admin') return;
      
      await api.messages.toggleMessageVisibility(messageId, true, reason);
      
      // Refresh messages
      const allMessages = await api.messages.getAllMessages();
      setMessages(allMessages);
    } catch (error) {
      console.error('Error hiding message:', error);
    }
  };
  
  // Handle unhide message (admin only)
  const handleUnhideMessage = async (messageId) => {
    try {
      if (!user || user.role !== 'admin') return;
      
      await api.messages.toggleMessageVisibility(messageId, false);
      
      // Refresh messages
      const allMessages = await api.messages.getAllMessages();
      setMessages(allMessages);
    } catch (error) {
      console.error('Error unhiding message:', error);
    }
  };
  
  // Handle ban user (admin only)
  const handleBanUser = async (userId) => {
    try {
      if (!user || user.role !== 'admin') return;
      
      await api.users.toggleUserBan(userId, true);
      
      // Refresh analytics
      const analyticsData = await api.analytics.getWeeklyAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };
  
  // Handle unban user (admin only)
  const handleUnbanUser = async (userId) => {
    try {
      if (!user || user.role !== 'admin') return;
      
      await api.users.toggleUserBan(userId, false);
      
      // Refresh analytics
      const analyticsData = await api.analytics.getWeeklyAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };
  
  // Handle set moderator (admin only)
  const handleSetModerator = async (userId) => {
    try {
      if (!user || user.role !== 'admin') return;
      
      await api.users.setUserRole(userId, 'moderator');
      
      // Refresh analytics
      const analyticsData = await api.analytics.getWeeklyAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error setting moderator:', error);
    }
  };
  
  // Handle remove moderator (admin only)
  const handleRemoveModerator = async (userId) => {
    try {
      if (!user || user.role !== 'admin') return;
      
      await api.users.setUserRole(userId, 'user');
      
      // Refresh analytics
      const analyticsData = await api.analytics.getWeeklyAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error removing moderator:', error);
    }
  };
  
  // Handle update settings (admin only)
  const handleUpdateSettings = async (settings) => {
    try {
      if (!user || user.role !== 'admin') return;
      
      // In a real app, this would update settings in the database
      console.log('Settings updated:', settings);
      
      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      return false;
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
          <p className="text-text-secondary">{translations.messages?.loading || 'Loading...'}</p>
        </div>
      </div>
    );
  }
  
  // Render appropriate interface based on user role
  if (!user) {
    return (
      <GuestWelcome
        language={language}
        translations={translations}
        onContinueAsGuest={handleContinueAsGuest}
        onSignIn={handleSignIn}
      />
    );
  } else if (user.role === 'admin') {
    return (
      <AdminDashboard
        user={user}
        language={language}
        translations={translations}
        messages={messages}
        users={[]} // Would be loaded from API in a real app
        analytics={analytics}
        onHideMessage={handleHideMessage}
        onUnhideMessage={handleUnhideMessage}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        onSetModerator={handleSetModerator}
        onRemoveModerator={handleRemoveModerator}
        onUpdateSettings={handleUpdateSettings}
        onSignOut={handleSignOut}
      />
    );
  } else {
    return (
      <UserDashboard
        user={user}
        language={language}
        translations={translations}
        messages={messages}
        onPostMessage={handlePostMessage}
        onReaction={handleReaction}
        onSignOut={handleSignOut}
      />
    );
  }
}
