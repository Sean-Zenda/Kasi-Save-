// AI Configuration for KasiSave ChatGPT Integration
// 
// SETUP INSTRUCTIONS:
// 1. Get an OpenAI API key from: https://platform.openai.com/api-keys
// 2. Replace 'YOUR_OPENAI_API_KEY_HERE' with your actual API key
// 3. For production apps, use environment variables instead of hardcoding

export const AI_CONFIG = {
  // OpenAI API Configuration
  OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY_HERE',
  OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
  
  // AI Model Settings
  MODEL: 'gpt-3.5-turbo', // You can use 'gpt-4' for better responses (costs more)
  MAX_TOKENS: 300,
  TEMPERATURE: 0.7,
  
  // Rate Limiting Settings
  MAX_REQUESTS_PER_MINUTE: 3, // Conservative limit for free tier
  REQUEST_INTERVAL_MS: 20000, // Minimum 20 seconds between requests
  MAX_RETRY_ATTEMPTS: 3,
  INITIAL_RETRY_DELAY_MS: 2000, // Start with 2 seconds
  RETRY_BACKOFF_MULTIPLIER: 2, // Double delay each retry
  
  // Request Management
  REQUEST_TIMEOUT_MS: 30000, // 30 second timeout
  REQUEST_QUEUE_SIZE: 5, // Maximum queued requests
  DUPLICATE_REQUEST_WINDOW_MS: 10000, // 10 seconds to detect duplicates
  
  // Fallback Settings
  USE_FALLBACK_WHEN_API_FAILS: true,
  SHOW_API_STATUS: true,
  TYPING_DELAY_MS: 1500, // Simulated typing delay for fallbacks
  
  // User Experience
  SHOW_RATE_LIMIT_WARNINGS: true,
  AUTO_RETRY_ON_RATE_LIMIT: true,
  GRACEFUL_DEGRADATION: true,
};

// Helper function to check if API is configured
export const isAPIConfigured = () => {
  return AI_CONFIG.OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE' && 
         AI_CONFIG.OPENAI_API_KEY.length > 0;
};

// Helper function to validate API key format
export const isValidAPIKey = (apiKey) => {
  return apiKey.startsWith('sk-') && apiKey.length > 20;
};

// Development/Demo mode check
export const isDemoMode = () => {
  return !isAPIConfigured() || process.env.NODE_ENV === 'development';
};

// Rate Limiting Manager Class
class RateLimitManager {
  constructor() {
    this.requestTimes = [];
    this.pendingRequests = new Map();
    this.lastRequestTime = 0;
  }

  // Check if we can make a request now
  canMakeRequest() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Clean old request times
    this.requestTimes = this.requestTimes.filter(time => time > oneMinuteAgo);
    
    // Check rate limit and minimum interval
    const withinRateLimit = this.requestTimes.length < AI_CONFIG.MAX_REQUESTS_PER_MINUTE;
    const enoughTimePassed = (now - this.lastRequestTime) >= AI_CONFIG.REQUEST_INTERVAL_MS;
    
    return withinRateLimit && enoughTimePassed;
  }

  // Calculate how long to wait before next request
  getWaitTime() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const timeToWait = Math.max(0, AI_CONFIG.REQUEST_INTERVAL_MS - timeSinceLastRequest);
    
    // If we're at rate limit, wait until oldest request expires
    if (this.requestTimes.length >= AI_CONFIG.MAX_REQUESTS_PER_MINUTE) {
      const oldestRequest = this.requestTimes[0];
      const waitForRateLimit = Math.max(0, oldestRequest + 60000 - now);
      return Math.max(timeToWait, waitForRateLimit);
    }
    
    return timeToWait;
  }

  // Record a successful request
  recordRequest() {
    const now = Date.now();
    this.requestTimes.push(now);
    this.lastRequestTime = now;
  }

  // Check if request is duplicate
  isDuplicateRequest(requestKey) {
    return this.pendingRequests.has(requestKey);
  }

  // Store pending request
  storePendingRequest(requestKey, promise) {
    this.pendingRequests.set(requestKey, promise);
    
    // Clean up after request completes
    promise.finally(() => {
      setTimeout(() => {
        this.pendingRequests.delete(requestKey);
      }, AI_CONFIG.DUPLICATE_REQUEST_WINDOW_MS);
    });
  }

  // Get pending request if exists
  getPendingRequest(requestKey) {
    return this.pendingRequests.get(requestKey);
  }
}

// Create singleton instance
export const rateLimitManager = new RateLimitManager();

// Retry logic with exponential backoff
export const withRetry = async (operation, attempts = AI_CONFIG.MAX_RETRY_ATTEMPTS) => {
  let lastError;
  
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error instanceof Error) {
        if (error.message.includes('Invalid API key') || 
            error.message.includes('401')) {
          throw error;
        }
      }
      
      // If this is the last attempt, throw the error
      if (attempt === attempts) {
        throw lastError;
      }
      
      // Calculate delay with exponential backoff
      const baseDelay = AI_CONFIG.INITIAL_RETRY_DELAY_MS;
      const delay = baseDelay * Math.pow(AI_CONFIG.RETRY_BACKOFF_MULTIPLIER, attempt - 1);
      
      console.log(`API attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Export for easy importing
export default AI_CONFIG;