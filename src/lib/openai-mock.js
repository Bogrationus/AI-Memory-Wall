/**
 * Mock implementation of OpenAI API for AI Memory Wall
 * Simulates content moderation, greeting generation, and analytics
 */

// Mock OpenAI API client
const openAIMock = {
  // Content moderation API
  moderation: {
    create: async (input) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Simple toxicity detection based on keywords
      const toxicWords = [
        'terrible', 'hate', 'stupid', 'idiot', 'dumb', 'bad', 'awful', 
        'horrible', 'worst', 'sucks', 'garbage', 'trash', 'useless',
        'ужасный', 'ненавижу', 'тупой', 'идиот', 'дурак', 'плохой'
      ];
      
      // Calculate mock toxicity score
      let toxicityScore = 0;
      const lowerInput = input.toLowerCase();
      
      // Check for toxic words
      toxicWords.forEach(word => {
        if (lowerInput.includes(word)) {
          toxicityScore += 0.2; // Increase score for each toxic word
        }
      });
      
      // Check for excessive punctuation (potential anger)
      const exclamationCount = (lowerInput.match(/!/g) || []).length;
      if (exclamationCount > 2) {
        toxicityScore += 0.1 * exclamationCount;
      }
      
      // Check for ALL CAPS (potential shouting)
      const words = input.split(' ');
      const capsWordCount = words.filter(word => word === word.toUpperCase() && word.length > 2).length;
      if (capsWordCount > 1) {
        toxicityScore += 0.1 * capsWordCount;
      }
      
      // Cap at 1.0
      toxicityScore = Math.min(toxicityScore, 1.0);
      
      return {
        results: [{
          categories: {
            hate: toxicityScore > 0.7,
            'hate/threatening': toxicityScore > 0.8,
            'self-harm': false,
            sexual: false,
            'sexual/minors': false,
            violence: toxicityScore > 0.9,
            'violence/graphic': false
          },
          category_scores: {
            hate: toxicityScore * 0.8,
            'hate/threatening': toxicityScore * 0.7,
            'self-harm': 0.01,
            sexual: 0.01,
            'sexual/minors': 0.01,
            violence: toxicityScore * 0.6,
            'violence/graphic': 0.01
          },
          flagged: toxicityScore > 0.7
        }]
      };
    }
  },
  
  // Chat completion API for greetings and inspiration
  chat: {
    completions: {
      create: async ({ model, messages, temperature, max_tokens, stream }) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Extract the prompt from messages
        const lastMessage = messages[messages.length - 1];
        const prompt = lastMessage.content.toLowerCase();
        
        // Determine the type of response needed
        let response = '';
        
        if (prompt.includes('greeting') || prompt.includes('welcome')) {
          // Generate greeting based on time, language, and user type
          const timeMatch = prompt.match(/time: (\w+)/);
          const langMatch = prompt.match(/language: (\w+)/);
          const userTypeMatch = prompt.match(/user_type: (\w+)/);
          
          const time = timeMatch ? timeMatch[1] : 'morning';
          const lang = langMatch ? langMatch[1] : 'en';
          const userType = userTypeMatch ? userTypeMatch[1] : 'new';
          
          if (lang === 'ru') {
            // Russian greetings
            if (time === 'morning') {
              response = 'Доброе утро';
            } else if (time === 'afternoon') {
              response = 'Добрый день';
            } else if (time === 'evening') {
              response = 'Добрый вечер';
            } else {
              response = 'Доброй ночи';
            }
            
            if (userType === 'new') {
              response += '! Рады приветствовать вас в нашей гостевой книге AI Memory Wall. Здесь вы можете поделиться своими мыслями и прочитать сообщения других пользователей.';
            } else if (userType === 'returning') {
              response += '! Рады видеть вас снова. Что нового вы хотели бы поделиться сегодня?';
            } else {
              response += ', наш частый гость! Всегда приятно видеть вас здесь. Ваше присутствие делает наше сообщество лучше.';
            }
          } else {
            // English greetings
            if (time === 'morning') {
              response = 'Good morning';
            } else if (time === 'afternoon') {
              response = 'Good afternoon';
            } else if (time === 'evening') {
              response = 'Good evening';
            } else {
              response = 'Good night';
            }
            
            if (userType === 'new') {
              response += '! Welcome to AI Memory Wall guestbook. Feel free to share your thoughts and read messages from other users.';
            } else if (userType === 'returning') {
              response += '! Great to see you again. What would you like to share today?';
            } else {
              response += ', our frequent visitor! It\'s always a pleasure to see you here. Your presence makes our community better.';
            }
          }
        } else if (prompt.includes('inspiration') || prompt.includes('quote')) {
          // Generate inspiration quote based on language
          const langMatch = prompt.match(/language: (\w+)/);
          const lang = langMatch ? langMatch[1] : 'en';
          
          const inspirationQuotes = {
            en: [
              "Share a thought that inspired you today.",
              "What's the most interesting thing you've learned recently?",
              "If you could change one thing about the world, what would it be?",
              "What book or movie has influenced your thinking the most?",
              "Share a memory that always makes you smile.",
              "What's a skill you'd like to learn in the future?",
              "What's your favorite place you've ever visited?",
              "If you could have dinner with anyone, living or dead, who would it be?",
              "What's something you're looking forward to?",
              "Share a piece of advice that has helped you in life."
            ],
            ru: [
              "Поделитесь мыслью, которая вдохновила вас сегодня.",
              "Что самое интересное вы узнали в последнее время?",
              "Если бы вы могли изменить одну вещь в мире, что бы это было?",
              "Какая книга или фильм больше всего повлияли на ваше мышление?",
              "Поделитесь воспоминанием, которое всегда вызывает у вас улыбку.",
              "Какой навык вы хотели бы освоить в будущем?",
              "Какое ваше любимое место из всех, где вы бывали?",
              "Если бы вы могли поужинать с кем угодно, живым или мертвым, кто бы это был?",
              "Чего вы ждете с нетерпением?",
              "Поделитесь советом, который помог вам в жизни."
            ]
          };
          
          const quotes = inspirationQuotes[lang] || inspirationQuotes.en;
          response = quotes[Math.floor(Math.random() * quotes.length)];
        } else if (prompt.includes('analytics') || prompt.includes('report')) {
          // Generate analytics report
          response = JSON.stringify({
            summary: "Weekly activity report generated successfully",
            messageCount: Math.floor(Math.random() * 50) + 10,
            activeUsers: Math.floor(Math.random() * 20) + 5,
            avgToxicity: (Math.random() * 0.3).toFixed(2),
            totalReactions: Math.floor(Math.random() * 100) + 20,
            topWords: [
              { text: "great", count: Math.floor(Math.random() * 10) + 5 },
              { text: "interesting", count: Math.floor(Math.random() * 8) + 3 },
              { text: "thanks", count: Math.floor(Math.random() * 7) + 2 },
              { text: "awesome", count: Math.floor(Math.random() * 6) + 2 },
              { text: "cool", count: Math.floor(Math.random() * 5) + 1 }
            ],
            languageDistribution: {
              en: Math.floor(Math.random() * 70) + 30,
              ru: Math.floor(Math.random() * 30) + 10
            },
            sentimentDistribution: {
              positive: Math.floor(Math.random() * 60) + 30,
              neutral: Math.floor(Math.random() * 30) + 10,
              negative: Math.floor(Math.random() * 10) + 1
            }
          });
        } else {
          // Default response
          response = "I'm an AI assistant for the Memory Wall project. How can I help you today?";
        }
        
        // Handle streaming if requested
        if (stream) {
          // Mock streaming response
          const chunks = response.split(' ');
          let index = 0;
          
          const streamResponse = {
            async *[Symbol.asyncIterator]() {
              for (const chunk of chunks) {
                yield {
                  choices: [{
                    delta: { content: chunk + ' ' },
                    finish_reason: index === chunks.length - 1 ? 'stop' : null
                  }]
                };
                index++;
                await new Promise(resolve => setTimeout(resolve, 100));
              }
            }
          };
          
          return streamResponse;
        }
        
        // Return standard response
        return {
          choices: [{
            message: {
              role: 'assistant',
              content: response
            },
            finish_reason: 'stop'
          }]
        };
      }
    }
  }
};

export default openAIMock;
