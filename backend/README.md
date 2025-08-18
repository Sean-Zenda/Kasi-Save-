# KasiSave AI Backend

This directory contains the backend AI services for KasiSave's intelligent financial coaching system.

## Gemini AI Service

The `gemini-ai-service.ts` file provides intelligent financial coaching powered by Google's Gemini AI.

### Features

- **Intelligent Responses**: Uses Google's Gemini 1.5 Flash model for natural language understanding
- **Financial Context**: Analyzes user's spending patterns, bills, and budget data
- **Multi-language Support**: Supports English, Zulu, and Sotho with context-aware responses
- **Rate Limiting**: Built-in rate limiting to respect API limits (15 requests/minute)
- **Fallback Responses**: Intelligent fallback system when API is unavailable
- **Comprehensive Analysis**: 
  - Spending pattern analysis
  - Budget optimization recommendations
  - Bill payment reminders
  - Savings opportunity identification
  - Goal progress tracking

### Configuration

The Gemini API key is currently configured in the service file:
```
GEMINI_API_KEY = 'AIzaSyCeTA1R2IA-6dGBvLafwiTq8ZKi5_9QJI4'
```

### How It Works

1. **User Context**: The service creates a comprehensive system prompt with:
   - User's financial profile (savings, goals, streak)
   - Bill data and spending analysis
   - Budget information and usage
   - Language preferences
   - South African financial context

2. **Smart Analysis**: For users with bill data, it provides:
   - Monthly spending trends
   - Category breakdowns
   - Budget usage tracking
   - Unpaid/overdue bill alerts
   - Savings opportunities identification

3. **Intelligent Fallbacks**: When the API is unavailable, it provides contextual responses based on:
   - Keyword analysis
   - User's actual spending data
   - Goal progress
   - Bill status

### Usage

```typescript
import { geminiAIService } from './backend/gemini-ai-service';

// Generate AI response
const response = await geminiAIService.generateResponse(
  userMessage,
  userFinancialData,
  language
);

// Check if service is configured
const isReady = geminiAIService.isConfigured();
```

### Rate Limiting

- **Free Tier**: 15 requests per minute
- **Automatic Management**: Built-in rate limiter tracks requests
- **User-Friendly**: Shows countdown when limits are reached
- **Graceful Handling**: Falls back to intelligent responses during limits

### Security

- API calls are made client-side (suitable for demo/development)
- For production, consider moving API calls to a secure backend
- No sensitive user data is sent to the AI (only financial summaries)

### South African Context

The AI is specifically trained to understand:
- Stokvel savings culture
- Informal economy considerations
- Rand currency and local financial products
- Cultural financial practices
- Multi-language financial terminology

This makes the AI coach particularly effective for the target audience of informal workers in South Africa.