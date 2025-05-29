/**
 * API service for AI Memory Wall
 * Handles interactions with backend services (Supabase and OpenAI)
 */

import supabaseMock from './supabase-mock';
import openAIMock from './openai-mock';

// Use mock clients
const supabase = supabaseMock;
const openai = openAIMock;

// Auth services
export const authService = {
  // Sign in with OAuth provider
  signInWithProvider: async (provider) => {
    try {
      const { data, error } = await supabase.auth.signIn({ provider });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },
  
  // Sign in anonymously
  signInAnonymously: async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.user;
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      throw error;
    }
  },
  
  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
  
  // Get current user
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  // Get user metadata
  getUserMetadata: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users_meta')
        .select()
        .eq('user_id', userId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data[0] || null;
    } catch (error) {
      console.error('Error getting user metadata:', error);
      return null;
    }
  },
  
  // Update user metadata
  updateUserMetadata: async (userId, metadata) => {
    try {
      // Check if metadata exists
      const { data: existingData } = await supabase
        .from('users_meta')
        .select()
        .eq('user_id', userId);
      
      if (existingData && existingData.length > 0) {
        // Update existing metadata
        const { data, error } = await supabase
          .from('users_meta')
          .update(metadata)
          .eq('user_id', userId);
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data[0];
      } else {
        // Insert new metadata
        const { data, error } = await supabase
          .from('users_meta')
          .insert({ user_id: userId, ...metadata });
        
        if (error) {
          throw new Error(error.message);
        }
        
        return data[0];
      }
    } catch (error) {
      console.error('Error updating user metadata:', error);
      throw error;
    }
  }
};

// Message services
export const messageService = {
  // Get all messages
  getAllMessages: async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Get user data for each message
      const messagesWithUsers = await Promise.all(data.map(async (message) => {
        const { data: userData } = await supabase
          .from('users')
          .select('name, avatar')
          .eq('id', message.user_id);
        
        // Get reactions for the message
        const { data: reactionsData } = await supabase
          .from('reactions')
          .select('*')
          .eq('message_id', message.id);
        
        // Format reactions
        const reactions = {};
        reactionsData.forEach(reaction => {
          if (!reactions[reaction.emoji]) {
            reactions[reaction.emoji] = 0;
          }
          reactions[reaction.emoji]++;
        });
        
        return {
          ...message,
          user: userData[0] || null,
          reactions
        };
      }));
      
      return messagesWithUsers;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  },
  
  // Create a new message
  createMessage: async (content, userId, isAnonymous = false) => {
    try {
      // Detect language
      const language = content.match(/[а-яА-ЯёЁ]/) ? 'ru' : 'en';
      
      // Check content for toxicity
      const moderationResult = await openai.moderation.create(content);
      const toxicityScore = Math.max(
        ...Object.values(moderationResult.results[0].category_scores)
      );
      
      // Create message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          user_id: userId,
          content,
          toxicity_score: toxicityScore,
          hidden: moderationResult.results[0].flagged,
          hidden_reason: moderationResult.results[0].flagged ? 'Automatic toxicity detection' : null,
          language,
          anonymous: isAnonymous
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data[0];
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },
  
  // Hide/unhide message
  toggleMessageVisibility: async (messageId, hidden, reason = null) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({
          hidden,
          hidden_reason: hidden ? reason : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', messageId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data[0];
    } catch (error) {
      console.error('Error toggling message visibility:', error);
      throw error;
    }
  },
  
  // Add reaction to message
  addReaction: async (messageId, userId, emoji) => {
    try {
      // Check if reaction already exists
      const { data: existingData } = await supabase
        .from('reactions')
        .select()
        .eq('message_id', messageId)
        .eq('user_id', userId)
        .eq('emoji', emoji);
      
      if (existingData && existingData.length > 0) {
        // Remove existing reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existingData[0].id);
        
        if (error) {
          throw new Error(error.message);
        }
        
        return { added: false, removed: true };
      } else {
        // Add new reaction
        const { data, error } = await supabase
          .from('reactions')
          .insert({
            message_id: messageId,
            user_id: userId,
            emoji
          });
        
        if (error) {
          throw new Error(error.message);
        }
        
        return { added: true, removed: false, data: data[0] };
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  }
};

// User management services
export const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },
  
  // Ban/unban user
  toggleUserBan: async (userId, banned) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ banned })
        .eq('id', userId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data[0];
    } catch (error) {
      console.error('Error toggling user ban:', error);
      throw error;
    }
  },
  
  // Set user role
  setUserRole: async (userId, role) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data[0];
    } catch (error) {
      console.error('Error setting user role:', error);
      throw error;
    }
  }
};

// AI services
export const aiService = {
  // Generate personalized greeting
  generateGreeting: async (time, language, userType) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a friendly assistant that generates personalized greetings for users of a guestbook website.'
          },
          {
            role: 'user',
            content: `Generate a short, friendly greeting. time: ${time}, language: ${language}, user_type: ${userType}`
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating greeting:', error);
      
      // Fallback greetings
      const fallbacks = {
        en: {
          morning: 'Good morning! Welcome to AI Memory Wall.',
          afternoon: 'Good afternoon! Welcome to AI Memory Wall.',
          evening: 'Good evening! Welcome to AI Memory Wall.',
          night: 'Good night! Welcome to AI Memory Wall.'
        },
        ru: {
          morning: 'Доброе утро! Добро пожаловать в AI Memory Wall.',
          afternoon: 'Добрый день! Добро пожаловать в AI Memory Wall.',
          evening: 'Добрый вечер! Добро пожаловать в AI Memory Wall.',
          night: 'Доброй ночи! Добро пожаловать в AI Memory Wall.'
        }
      };
      
      return fallbacks[language]?.[time] || 'Welcome to AI Memory Wall!';
    }
  },
  
  // Generate inspiration quote
  generateInspiration: async (language) => {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that generates inspiring prompts for users to write messages in a guestbook.'
          },
          {
            role: 'user',
            content: `Generate a short, inspiring prompt or question to help users write a message. language: ${language}`
          }
        ],
        temperature: 0.8,
        max_tokens: 50
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating inspiration:', error);
      
      // Fallback inspirations
      const fallbacks = {
        en: [
          'Share a thought that inspired you today.',
          'What\'s the most interesting thing you\'ve learned recently?',
          'If you could change one thing about the world, what would it be?'
        ],
        ru: [
          'Поделитесь мыслью, которая вдохновила вас сегодня.',
          'Что самое интересное вы узнали в последнее время?',
          'Если бы вы могли изменить одну вещь в мире, что бы это было?'
        ]
      };
      
      const options = fallbacks[language] || fallbacks.en;
      return options[Math.floor(Math.random() * options.length)];
    }
  },
  
  // Check content for toxicity
  checkToxicity: async (content) => {
    try {
      const result = await openai.moderation.create(content);
      return {
        isToxic: result.results[0].flagged,
        score: Math.max(...Object.values(result.results[0].category_scores)),
        categories: result.results[0].categories
      };
    } catch (error) {
      console.error('Error checking toxicity:', error);
      return { isToxic: false, score: 0, categories: {} };
    }
  },
  
  // Generate weekly analytics report
  generateAnalyticsReport: async (messages, reactions, users) => {
    try {
      // In a real implementation, this would process the data and use AI to generate insights
      // For the mock, we'll return a predefined structure
      
      // Count messages by language
      const languageDistribution = {};
      messages.forEach(message => {
        if (!languageDistribution[message.language]) {
          languageDistribution[message.language] = 0;
        }
        languageDistribution[message.language]++;
      });
      
      // Count reactions by type
      const reactionDistribution = {};
      reactions.forEach(reaction => {
        if (!reactionDistribution[reaction.emoji]) {
          reactionDistribution[reaction.emoji] = 0;
        }
        reactionDistribution[reaction.emoji]++;
      });
      
      // Calculate average toxicity
      const avgToxicity = messages.reduce((sum, message) => sum + message.toxicity_score, 0) / messages.length;
      
      // Mock word frequency analysis
      const topWords = [
        { text: 'great', count: Math.floor(Math.random() * 10) + 5 },
        { text: 'thanks', count: Math.floor(Math.random() * 8) + 3 },
        { text: 'interesting', count: Math.floor(Math.random() * 7) + 2 },
        { text: 'awesome', count: Math.floor(Math.random() * 6) + 2 },
        { text: 'cool', count: Math.floor(Math.random() * 5) + 1 }
      ];
      
      return {
        messageCount: messages.length,
        activeUsers: users.filter(user => !user.banned).length,
        avgToxicity,
        totalReactions: reactions.length,
        topWords,
        languageDistribution,
        reactionDistribution,
        timeDistribution: {
          morning: Math.floor(messages.length * 0.3),
          afternoon: Math.floor(messages.length * 0.4),
          evening: Math.floor(messages.length * 0.2),
          night: Math.floor(messages.length * 0.1)
        }
      };
    } catch (error) {
      console.error('Error generating analytics report:', error);
      throw error;
    }
  }
};

// Analytics services
export const analyticsService = {
  // Get weekly analytics
  getWeeklyAnalytics: async () => {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .order('week_start', { ascending: false })
        .limit(1);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data[0]?.report_json || null;
    } catch (error) {
      console.error('Error getting weekly analytics:', error);
      throw error;
    }
  },
  
  // Generate and save new analytics report
  generateAndSaveAnalytics: async () => {
    try {
      // Get data for analysis
      const { data: messages } = await supabase.from('messages').select('*');
      const { data: reactions } = await supabase.from('reactions').select('*');
      const { data: users } = await supabase.from('users').select('*');
      
      // Generate report
      const report = await aiService.generateAnalyticsReport(messages, reactions, users);
      
      // Calculate week start and end
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      // Save report
      const { data, error } = await supabase
        .from('analytics')
        .insert({
          week_start: weekStart.toISOString(),
          week_end: weekEnd.toISOString(),
          report_json: report,
          created_at: now.toISOString()
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data[0];
    } catch (error) {
      console.error('Error generating and saving analytics:', error);
      throw error;
    }
  }
};

export default {
  auth: authService,
  messages: messageService,
  users: userService,
  ai: aiService,
  analytics: analyticsService
};
