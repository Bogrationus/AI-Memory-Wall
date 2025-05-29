/**
 * Mock implementation of Supabase client for AI Memory Wall
 * Simulates database, authentication, and storage functionality
 */

// Mock database tables
let mockDB = {
  users: [
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      provider: 'google',
      provider_id: 'google-123',
      created_at: '2025-01-01T12:00:00Z',
      last_login: '2025-05-28T10:00:00Z',
      role: 'admin',
      banned: false,
      avatar: null
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      provider: 'github',
      provider_id: 'github-456',
      created_at: '2025-02-15T14:30:00Z',
      last_login: '2025-05-27T18:45:00Z',
      role: 'user',
      banned: false,
      avatar: null
    },
    {
      id: '3',
      email: 'moderator@example.com',
      name: 'Moderator User',
      provider: 'google',
      provider_id: 'google-789',
      created_at: '2025-03-10T09:15:00Z',
      last_login: '2025-05-28T08:20:00Z',
      role: 'moderator',
      banned: false,
      avatar: null
    },
    {
      id: '4',
      email: null,
      name: null,
      provider: 'anonymous',
      provider_id: 'anon-123',
      created_at: '2025-05-20T16:40:00Z',
      last_login: '2025-05-20T16:40:00Z',
      role: 'user',
      banned: false,
      avatar: null
    },
    {
      id: '5',
      email: 'banned@example.com',
      name: 'Banned User',
      provider: 'github',
      provider_id: 'github-999',
      created_at: '2025-04-05T11:25:00Z',
      last_login: '2025-04-25T13:10:00Z',
      role: 'user',
      banned: true,
      avatar: null
    }
  ],
  
  users_meta: [
    {
      id: '1',
      user_id: '1',
      device_type: 'desktop',
      os: 'Windows',
      utc_offset: 0,
      referrer: 'direct',
      utm_source: null,
      preferred_channel: 'email',
      theme: 'dark',
      frequency_bucket: 'power-user',
      language: 'en'
    },
    {
      id: '2',
      user_id: '2',
      device_type: 'mobile',
      os: 'iOS',
      utc_offset: -5,
      referrer: 'google',
      utm_source: 'newsletter',
      preferred_channel: 'telegram',
      theme: 'light',
      frequency_bucket: 'regular',
      language: 'ru'
    },
    {
      id: '3',
      user_id: '3',
      device_type: 'tablet',
      os: 'Android',
      utc_offset: 3,
      referrer: 'twitter',
      utm_source: null,
      preferred_channel: 'email',
      theme: 'auto',
      frequency_bucket: 'power-user',
      language: 'en'
    },
    {
      id: '4',
      user_id: '4',
      device_type: 'mobile',
      os: 'Android',
      utc_offset: 2,
      referrer: 'direct',
      utm_source: null,
      preferred_channel: null,
      theme: 'auto',
      frequency_bucket: 'new',
      language: 'ru'
    },
    {
      id: '5',
      user_id: '5',
      device_type: 'desktop',
      os: 'macOS',
      utc_offset: -8,
      referrer: 'facebook',
      utm_source: 'ad',
      preferred_channel: null,
      theme: 'light',
      frequency_bucket: 'regular',
      language: 'en'
    }
  ],
  
  messages: [
    {
      id: '1',
      user_id: '2',
      content: 'Привет всем! Это мой первый пост в этой гостевой книге. Очень рад быть здесь!',
      created_at: '2025-05-26T14:30:00Z',
      updated_at: '2025-05-26T14:30:00Z',
      toxicity_score: 0.01,
      hidden: false,
      hidden_reason: null,
      language: 'ru',
      anonymous: false
    },
    {
      id: '2',
      user_id: '3',
      content: 'Welcome to our AI Memory Wall! Feel free to share your thoughts and experiences here.',
      created_at: '2025-05-26T15:45:00Z',
      updated_at: '2025-05-26T15:45:00Z',
      toxicity_score: 0.02,
      hidden: false,
      hidden_reason: null,
      language: 'en',
      anonymous: false
    },
    {
      id: '3',
      user_id: '4',
      content: 'Интересный проект! Мне нравится идея AI-персонализации.',
      created_at: '2025-05-27T09:20:00Z',
      updated_at: '2025-05-27T09:20:00Z',
      toxicity_score: 0.03,
      hidden: false,
      hidden_reason: null,
      language: 'ru',
      anonymous: true
    },
    {
      id: '4',
      user_id: '5',
      content: 'This is a terrible website and you should all feel bad about yourselves!',
      created_at: '2025-05-27T16:10:00Z',
      updated_at: '2025-05-27T16:10:00Z',
      toxicity_score: 0.85,
      hidden: true,
      hidden_reason: 'Toxic content',
      language: 'en',
      anonymous: false
    },
    {
      id: '5',
      user_id: '2',
      content: 'I love how the site adapts to my preferences. The dark mode is especially nice for evening browsing.',
      created_at: '2025-05-28T10:15:00Z',
      updated_at: '2025-05-28T10:15:00Z',
      toxicity_score: 0.01,
      hidden: false,
      hidden_reason: null,
      language: 'en',
      anonymous: false
    }
  ],
  
  reactions: [
    {
      id: '1',
      message_id: '1',
      user_id: '3',
      emoji: 'like',
      created_at: '2025-05-26T14:35:00Z'
    },
    {
      id: '2',
      message_id: '1',
      user_id: '1',
      emoji: 'love',
      created_at: '2025-05-26T14:40:00Z'
    },
    {
      id: '3',
      message_id: '2',
      user_id: '2',
      emoji: 'like',
      created_at: '2025-05-26T15:50:00Z'
    },
    {
      id: '4',
      message_id: '2',
      user_id: '4',
      emoji: 'laugh',
      created_at: '2025-05-26T16:05:00Z'
    },
    {
      id: '5',
      message_id: '3',
      user_id: '1',
      emoji: 'like',
      created_at: '2025-05-27T09:30:00Z'
    },
    {
      id: '6',
      message_id: '5',
      user_id: '3',
      emoji: 'love',
      created_at: '2025-05-28T10:20:00Z'
    }
  ],
  
  analytics: [
    {
      id: '1',
      week_start: '2025-05-19T00:00:00Z',
      week_end: '2025-05-25T23:59:59Z',
      report_json: {
        messageCount: 2,
        activeUsers: 3,
        avgToxicity: 0.015,
        totalReactions: 4,
        topWords: [
          { text: 'welcome', count: 2 },
          { text: 'hello', count: 2 },
          { text: 'thoughts', count: 1 },
          { text: 'experiences', count: 1 },
          { text: 'привет', count: 1 }
        ],
        languageDistribution: {
          en: 1,
          ru: 1
        },
        timeDistribution: {
          morning: 0,
          afternoon: 2,
          evening: 0,
          night: 0
        }
      },
      created_at: '2025-05-26T00:05:00Z'
    },
    {
      id: '2',
      week_start: '2025-05-26T00:00:00Z',
      week_end: '2025-05-28T23:59:59Z', // Current week (partial)
      report_json: {
        messageCount: 3,
        activeUsers: 4,
        avgToxicity: 0.29,
        totalReactions: 2,
        topWords: [
          { text: 'ai', count: 2 },
          { text: 'интересный', count: 1 },
          { text: 'проект', count: 1 },
          { text: 'love', count: 1 },
          { text: 'dark', count: 1 }
        ],
        languageDistribution: {
          en: 2,
          ru: 1
        },
        timeDistribution: {
          morning: 2,
          afternoon: 0,
          evening: 1,
          night: 0
        }
      },
      created_at: '2025-05-28T12:00:00Z'
    }
  ]
};

// Current authenticated user
let currentUser = null;

// Mock Supabase client
const supabaseMock = {
  // Auth methods
  auth: {
    signIn: async ({ provider, email, password }) => {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (provider) {
        // OAuth sign in
        const user = mockDB.users.find(u => u.provider === provider);
        if (user) {
          currentUser = { ...user };
          return { data: { user: currentUser }, error: null };
        }
      } else if (email && password) {
        // Email sign in (not implemented in mock)
        return { data: null, error: { message: 'Email authentication not implemented in mock' } };
      }
      
      return { data: null, error: { message: 'Authentication failed' } };
    },
    
    signOut: async () => {
      // Simulate sign out delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      currentUser = null;
      return { error: null };
    },
    
    signInAnonymously: async () => {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const anonUser = mockDB.users.find(u => u.provider === 'anonymous');
      if (anonUser) {
        currentUser = { ...anonUser };
        return { data: { user: currentUser }, error: null };
      }
      
      return { data: null, error: { message: 'Anonymous authentication failed' } };
    },
    
    getUser: () => {
      return { data: { user: currentUser }, error: null };
    }
  },
  
  // Database methods
  from: (tableName) => {
    return {
      select: (columns = '*') => {
        return {
          eq: (column, value) => {
            // Filter by equality
            const filteredData = mockDB[tableName].filter(row => row[column] === value);
            return {
              data: filteredData,
              error: null
            };
          },
          
          order: (column, { ascending = true } = {}) => {
            // Sort data
            const sortedData = [...mockDB[tableName]].sort((a, b) => {
              if (ascending) {
                return a[column] > b[column] ? 1 : -1;
              } else {
                return a[column] < b[column] ? 1 : -1;
              }
            });
            
            return {
              data: sortedData,
              error: null
            };
          },
          
          then: (callback) => {
            // Return all data
            callback({ data: mockDB[tableName], error: null });
          }
        };
      },
      
      insert: (data) => {
        // Generate ID if not provided
        const newData = Array.isArray(data) ? data : [data];
        
        newData.forEach(item => {
          if (!item.id) {
            item.id = (mockDB[tableName].length + 1).toString();
          }
          
          // Add timestamps if not provided
          if (!item.created_at) {
            item.created_at = new Date().toISOString();
          }
          
          if (tableName === 'messages' && !item.updated_at) {
            item.updated_at = new Date().toISOString();
          }
          
          mockDB[tableName].push(item);
        });
        
        return {
          data: newData,
          error: null
        };
      },
      
      update: (data) => {
        return {
          eq: (column, value) => {
            // Find and update records
            const updatedRecords = [];
            
            mockDB[tableName] = mockDB[tableName].map(row => {
              if (row[column] === value) {
                const updatedRow = { ...row, ...data };
                updatedRecords.push(updatedRow);
                return updatedRow;
              }
              return row;
            });
            
            return {
              data: updatedRecords,
              error: null
            };
          }
        };
      },
      
      delete: () => {
        return {
          eq: (column, value) => {
            // Find and delete records
            const deletedRecords = mockDB[tableName].filter(row => row[column] === value);
            mockDB[tableName] = mockDB[tableName].filter(row => row[column] !== value);
            
            return {
              data: deletedRecords,
              error: null
            };
          }
        };
      }
    };
  },
  
  // Storage methods
  storage: {
    from: (bucketName) => {
      return {
        upload: async (path, file) => {
          // Simulate upload delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          return {
            data: { path },
            error: null
          };
        },
        
        download: async (path) => {
          // Simulate download delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          return {
            data: { url: `https://mock-storage.example.com/${bucketName}/${path}` },
            error: null
          };
        },
        
        getPublicUrl: (path) => {
          return {
            data: { publicUrl: `https://mock-storage.example.com/${bucketName}/${path}` },
            error: null
          };
        }
      };
    }
  },
  
  // Helper methods for mock data manipulation
  _mock: {
    // Reset mock database to initial state
    resetDB: () => {
      mockDB = { ...mockDB };
    },
    
    // Get current mock database state
    getDB: () => {
      return mockDB;
    },
    
    // Set current user for testing
    setCurrentUser: (user) => {
      currentUser = user;
    }
  }
};

export default supabaseMock;
