import { GoogleGenerativeAI } from '@google/generative-ai';

// Mock interface to match expected structure when Gemini is not available
interface MockGeminiService {
  getFinancialAdvice: (
    userMessage: string, 
    context: {
      user: any;
      language: string;
      context: string;
      responseLanguage?: string;
    }
  ) => Promise<string>;
}

interface GeminiConfig {
  apiKey: string;
  model: string;
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
  safetySettings: Array<{
    category: string;
    threshold: string;
  }>;
}

class GeminiAIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isAvailable = false;
  private initializationError: string | null = null;
  private apiKey: string | null = null;

  constructor() {
    this.initialize();
  }

  private validateApiKey(apiKey: string): boolean {
    // Basic validation for Google AI API key format
    // Google AI API keys typically start with "AIza" and are about 39 characters long
    if (!apiKey || typeof apiKey !== 'string') {
      return false;
    }
    
    // Remove whitespace
    apiKey = apiKey.trim();
    
    // Check format - should start with AIza and be reasonable length
    if (!apiKey.startsWith('AIza') || apiKey.length < 30 || apiKey.length > 50) {
      return false;
    }
    
    // Check for placeholder values
    const placeholders = [
      'your-gemini-api-key-here',
      'YOUR_API_KEY_HERE',
      'REPLACE_WITH_YOUR_KEY',
      'your-api-key'
    ];
    
    if (placeholders.includes(apiKey.toLowerCase())) {
      return false;
    }
    
    return true;
  }

  private initialize() {
    try {
      console.log('🤖 Initializing Gemini AI service with Flash 2.0...');
      
      // Try multiple sources for the API key - prioritize environment variable, then use the working key
      const possibleKeys = [
        import.meta.env?.VITE_GEMINI_API_KEY,
        (window as any).VITE_GEMINI_API_KEY,
        'AIzaSyAImggawziJKKgnQxpp2SXkvfsGzc-6eNk' // Working API key for KasiSave
      ].filter(Boolean);
      
      console.log('🔍 Checking for API key...');
      console.log('   Environment variable present:', !!import.meta.env?.VITE_GEMINI_API_KEY);
      
      let validApiKey: string | null = null;
      
      for (const key of possibleKeys) {
        if (key && this.validateApiKey(key)) {
          validApiKey = key;
          console.log('✅ Found valid API key format');
          break;
        } else if (key) {
          console.log('❌ Invalid API key format detected for key:', key.substring(0, 10) + '...');
        }
      }
      
      if (!validApiKey) {
        this.initializationError = 'No valid API key found. Please set VITE_GEMINI_API_KEY environment variable with a valid Google AI API key.';
        console.warn('❌ No valid Gemini API key found');
        console.log('📝 To use your own API key:');
        console.log('   1. Get a Google AI API key from https://makersuite.google.com/app/apikey');
        console.log('   2. Set VITE_GEMINI_API_KEY=your_api_key in your environment');
        console.log('   3. Restart the application');
        this.isAvailable = false;
        return;
      }

      this.apiKey = validApiKey;
      console.log('🚀 Creating GoogleGenerativeAI instance with key:', validApiKey.substring(0, 10) + '...');
      this.genAI = new GoogleGenerativeAI(validApiKey);
      
      console.log('🔧 Configuring Gemini 2.0 Flash model...');
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });
      
      this.isAvailable = true;
      console.log('✅ Gemini 2.0 Flash AI service initialized successfully');
    } catch (error) {
      this.initializationError = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Failed to initialize Gemini AI service:', error);
      this.isAvailable = false;
    }
  }

  async getFinancialAdvice(
    userMessage: string,
    context: {
      user: {
        name: string;
        totalSaved: number;
        goals: any[];
        bills?: any[];
        monthlyBudget?: number;
        gamificationStats: {
          level: number;
          streak: number;
        };
      };
      language: string;
      context: string;
      responseLanguage?: string;
    }
  ): Promise<string> {
    if (!this.isAvailable || !this.model) {
      const errorMsg = this.initializationError || 'Service not initialized';
      console.error('🚫 Gemini AI service not available:', errorMsg);
      throw new Error(`Gemini AI service not available: ${errorMsg}`);
    }

    try {
      const responseLanguage = context.responseLanguage || context.language || 'en';
      
      console.log('🎯 Generating AI response with Gemini 2.0 Flash...');
      console.log('   User:', context.user.name);
      console.log('   Language:', responseLanguage);
      console.log('   Message:', userMessage.substring(0, 50) + '...');
      
      // Language-specific system prompts (NO EMOJIS) - Enhanced for Flash 2.0
      const languagePrompts = {
        en: {
          systemRole: "You are a professional South African financial coach AI assistant specifically designed for the KasiSave app. You help users with savings, budgeting, and financial planning in the South African context. You have deep knowledge of local financial instruments, challenges, and opportunities.",
          responseInstruction: "Respond in clear, professional English with a warm but professional tone. Do not use emojis in your response. Provide actionable, specific advice tailored to South African financial realities.",
          currency: "South African Rand (R)",
          context: "South African financial context including Stokvels, eWallet payments, local banking systems, economic conditions, and financial challenges unique to South Africa"
        },
        zu: {
          systemRole: "Ungumncedisi we-AI okhawuleza ophakathi kwezezimali eNingizimu Afrika oziklungele ukusiza abasebenzisi nge-app yakwa-KasiSave. Usiza abantu ngokonga, ukwenza ibhajethi, nokuhlela kwezezimali ngaphansi kwemeko yaseNingizimu Afrika. Unolwazi olujulile ngezinsiza zezezimali zasendaweni, izinselelo namathuba.",
          responseInstruction: "Phendula ngesiZulu ngedlela ecacile, ekhawulezayo nefudumala kodwa ephrofeshenali. Ungasebenzisi ama-emoji empendulweni yakho. Nikeza izeluleko ezisebenzayo, ezikhethekile ezihambisana nemeko yangempela yezezimali eNingizimu Afrika.",
          currency: "Rand yaseNingizimu Afrika (R)",
          context: "umongo wezezimali waseNingizimu Afrika ohlanganisa amaStokvel, ukukhokha nge-eWallet, izinhlelo zamabhange asendaweni, izimo zomnotho, nezinselelo zezezimali ezikhethekile eNingizimu Afrika"
        },
        st: {
          systemRole: "O moeletsi wa AI wa ditjhelete e botsoalle wa Afrika Borwa e ikemisetitseng ho sebetsa le app ya KasiSave. O thusa badirisi ka poloko, ho etsa tekanyetso, le ho rera ditjhelete ka maemo a Afrika Borwa. O na le tsebo e tebileng ya didirisiwa tsa ditjhelete tsa lehae, ditlhohlo le menyetla.",
          responseInstruction: "Araba ka Sesotho ka mokgwa o hlakileng, o kgokahang le o mofuthu empa o profešenale. O se ke wa sebedisa di-emoji karabong ya hao. Fana ka dikeletso tse sebetsang, tse ikgethang tse lumellanang le maemo a nnete a ditjhelete a Afrika Borwa.",
          currency: "Rand ya Afrika Borwa (R)",
          context: "seemo sa ditjhelete sa Afrika Borwa se kenyelletsang diStokvel, ditefo tsa eWallet, ditsamaiso tsa dibanka tsa lehae, maemo a moruo, le ditlhohlo tsa ditjhelete tse ikgethang ho Afrika Borwa"
        }
      };

      const langConfig = languagePrompts[responseLanguage as keyof typeof languagePrompts] || languagePrompts.en;

      const systemPrompt = `${langConfig.systemRole}

IMPORTANT INSTRUCTIONS: ${langConfig.responseInstruction}

CONTEXT ABOUT THE USER:
- Name: ${context.user.name}
- Total Saved: ${langConfig.currency}${context.user.totalSaved.toLocaleString()}
- Active Savings Goals: ${context.user.goals.length} goals
- Current Gamification Level: ${context.user.gamificationStats.level}
- Savings Streak: ${context.user.gamificationStats.streak} consecutive days
- Monthly Budget: ${langConfig.currency}${(context.user.monthlyBudget || 5000).toLocaleString()}
- Bills Tracked: ${context.user.bills?.length || 0} monthly bills

RESPONSE GUIDELINES:
1. Always be encouraging and positive about their financial journey while being realistic
2. Provide practical, actionable advice specifically relevant to ${langConfig.context}
3. Keep responses concise but comprehensive (150-250 words optimal)
4. Always use South African Rand (R) for all monetary amounts and examples
5. Reference their actual savings data, goals, and progress when giving personalized advice
6. Mention relevant KasiSave features like Stokvels, goal tracking, or budget monitoring when appropriate
7. Be culturally aware and sensitive to South African financial realities, including economic challenges
8. Do NOT use any emojis, symbols, or decorative characters - maintain professional text only
9. Provide realistic examples with South African context (income levels, costs, financial products)
10. Focus on practical, immediately actionable steps they can take
11. Consider local factors like load-shedding, transportation costs, and informal economy when relevant
12. Reference South African financial institutions, products, and regulations when appropriate

USER'S QUESTION: "${userMessage}"

RESPONSE REQUIREMENTS:
- Language: ${responseLanguage === 'en' ? 'English' : responseLanguage === 'zu' ? 'isiZulu' : 'Sesotho'}
- Tone: Professional, warm, and encouraging
- Format: Clear, structured advice with specific actionable steps
- Content: Practical financial coaching tailored to their specific situation and South African context
- No emojis, symbols, or decorative formatting

Provide comprehensive, personalized financial advice that addresses their question while considering their current financial situation and South African context.`;

      console.log('🔄 Sending request to Gemini 2.0 Flash API...');
      const result = await this.model.generateContent(systemPrompt);
      
      console.log('📥 Received response from Gemini 2.0 Flash API');
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        console.error('❌ Empty response from Gemini 2.0 Flash API');
        throw new Error('Empty response from Gemini API');
      }

      console.log('✅ Successfully generated Gemini 2.0 Flash AI response');
      console.log('   Response length:', text.length, 'characters');
      console.log('   Response preview:', text.substring(0, 100) + '...');
      
      // Clean up any potential emojis that might have slipped through
      const cleanedText = text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
      
      return cleanedText;
    } catch (error) {
      console.error('❌ Error getting Gemini 2.0 Flash AI response:', error);
      
      // More specific error logging and handling
      if (error instanceof Error) {
        console.error('   Error name:', error.name);
        console.error('   Error message:', error.message);
        
        // Check for specific API errors
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
          console.error('   → API key validation failed');
          // Mark service as unavailable due to invalid key
          this.isAvailable = false;
          this.initializationError = 'Invalid API key. Please check your Google AI API key.';
          throw new Error('Invalid API key - Please set a valid VITE_GEMINI_API_KEY environment variable');
        } else if (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED')) {
          console.error('   → API quota exceeded');
          throw new Error('API quota exceeded - please try again later');
        } else if (error.message.includes('blocked') || error.message.includes('SAFETY')) {
          console.error('   → Request blocked by safety filters');
          throw new Error('Request blocked by safety filters - please rephrase your question');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          console.error('   → Network connectivity issue');
          throw new Error('Network connectivity issue - check your internet connection');
        } else if (error.message.includes('PERMISSION_DENIED')) {
          console.error('   → Permission denied - check API key permissions');
          throw new Error('Permission denied - please check your API key permissions');
        } else if (error.message.includes('model') || error.message.includes('MODEL_NOT_FOUND')) {
          console.error('   → Model not found - falling back to gemini-pro');
          // Try fallback to gemini-pro if 2.0-flash is not available
          try {
            console.log('🔄 Trying fallback to gemini-pro...');
            const fallbackModel = this.genAI!.getGenerativeModel({ 
              model: "gemini-pro",
              generationConfig: {
                temperature: 0.7,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
              },
            });
            const fallbackResult = await fallbackModel.generateContent(systemPrompt);
            const fallbackResponse = await fallbackResult.response;
            const fallbackText = fallbackResponse.text();
            console.log('✅ Fallback to gemini-pro successful');
            return fallbackText.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
          } catch (fallbackError) {
            console.error('❌ Fallback to gemini-pro also failed:', fallbackError);
            throw new Error('Model not available - both Gemini 2.0 Flash and Gemini Pro failed');
          }
        }
      }
      
      // Re-throw the original error for fallback handling
      throw error;
    }
  }

  isServiceAvailable(): boolean {
    const available = this.isAvailable && this.model !== null;
    console.log(`🔍 Gemini 2.0 Flash service availability check: ${available ? '✅ Available' : '❌ Not available'}`);
    if (!available && this.initializationError) {
      console.log(`   Error: ${this.initializationError}`);
    }
    return available;
  }

  getInitializationError(): string | null {
    return this.initializationError;
  }

  getApiKeyStatus(): { hasKey: boolean; isValid: boolean; source: string } {
    const envKey = import.meta.env?.VITE_GEMINI_API_KEY;
    const windowKey = (window as any).VITE_GEMINI_API_KEY;
    
    if (envKey) {
      return {
        hasKey: true,
        isValid: this.validateApiKey(envKey),
        source: 'Environment Variable (VITE_GEMINI_API_KEY)'
      };
    } else if (windowKey) {
      return {
        hasKey: true,
        isValid: this.validateApiKey(windowKey),
        source: 'Window Variable'
      };
    } else {
      return {
        hasKey: true,
        isValid: true,
        source: 'Hardcoded KasiSave API Key'
      };
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    console.log('🏥 Running Gemini 2.0 Flash health check...');
    
    if (!this.isAvailable) {
      console.log('❌ Health check failed - service not available');
      return false;
    }

    try {
      const testResult = await this.getFinancialAdvice(
        "Hello, are you working?",
        {
          user: {
            name: "Test User",
            totalSaved: 1000,
            goals: [],
            gamificationStats: { level: 1, streak: 1 }
          },
          language: 'en',
          context: 'health_check'
        }
      );
      
      const success = testResult.length > 0;
      console.log(`${success ? '✅' : '❌'} Gemini 2.0 Flash health check ${success ? 'passed' : 'failed'}`);
      return success;
    } catch (error) {
      console.error('❌ Gemini 2.0 Flash health check failed:', error);
      return false;
    }
  }

  // Method to retry initialization if it failed
  async retryInitialization(): Promise<boolean> {
    console.log('🔄 Retrying Gemini 2.0 Flash initialization...');
    this.isAvailable = false;
    this.initializationError = null;
    this.genAI = null;
    this.model = null;
    this.apiKey = null;
    
    this.initialize();
    
    if (this.isAvailable) {
      console.log('✅ Gemini 2.0 Flash retry successful');
      return true;
    } else {
      console.log('❌ Gemini 2.0 Flash retry failed');
      return false;
    }
  }

  // Method to manually set API key (for testing or runtime configuration)
  setApiKey(apiKey: string): boolean {
    if (!this.validateApiKey(apiKey)) {
      console.error('❌ Invalid API key format provided');
      return false;
    }

    this.apiKey = apiKey;
    this.initialize();
    return this.isAvailable;
  }

  // Get model information
  getModelInfo(): { name: string; version: string } {
    return {
      name: "Gemini 2.0 Flash",
      version: "experimental"
    };
  }
}

// Create singleton instance
const geminiAIService = new GeminiAIService();

// Export the service
export { geminiAIService };
export type { GeminiConfig };

// Also create a mock service for fallback
const mockGeminiService: MockGeminiService = {
  async getFinancialAdvice(userMessage: string, context: any): Promise<string> {
    // This should not be called directly, but provides the interface
    throw new Error('Mock Gemini service called - use fallback responses instead');
  }
};

// Export both for different use cases
export { mockGeminiService };