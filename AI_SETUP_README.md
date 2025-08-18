# KasiSave AI Coach - ChatGPT Integration Setup

## Overview
The KasiSave AI Coach now supports real ChatGPT responses for personalized financial advice with robust rate limiting to prevent API errors and manage costs effectively.

## Quick Setup

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy your API key (starts with `sk-`)

### 2. Configure the API Key
1. Open `/config/ai-config.ts`
2. Replace `'YOUR_OPENAI_API_KEY_HERE'` with your actual API key:
   ```typescript
   OPENAI_API_KEY: 'sk-your-actual-api-key-here',
   ```

### 3. Set Up Rate Limits (Important!)
The app comes with conservative rate limiting to prevent errors:

```typescript
MAX_REQUESTS_PER_MINUTE: 3,    // Very conservative for free tier
REQUEST_INTERVAL_MS: 20000,    // 20 seconds between requests
```

**For paid OpenAI accounts**, you can increase these:
```typescript
MAX_REQUESTS_PER_MINUTE: 20,   // Higher limits for paid accounts
REQUEST_INTERVAL_MS: 5000,     // 5 seconds between requests
```

## Rate Limiting Features

### Smart Request Management
- **Request Queuing**: Prevents duplicate requests
- **Automatic Retry**: Failed requests retry with exponential backoff
- **Rate Limit Detection**: Automatically switches to fallback when limits hit
- **User Feedback**: Shows wait times and progress bars

### Visual Indicators
- 🟢 Green dot: ChatGPT connected and ready
- 🟠 Orange dot: Rate limited or demo mode
- ⏱️ Clock icon: Shows remaining wait time
- Progress bar: Visual countdown for rate limits

### Graceful Degradation
- **Fallback Responses**: Intelligent responses when API unavailable
- **Context Awareness**: Fallbacks use user's actual savings data
- **No Interruption**: Users can always get helpful advice

## Troubleshooting Rate Limits

### "Rate limit exceeded" Errors

**For Free Tier Users:**
1. Use the default conservative settings
2. Wait for the countdown timer before sending messages
3. App automatically uses fallback responses when needed

**For Paid Users:**
1. Check your OpenAI usage dashboard
2. Increase rate limits in config if needed
3. Consider upgrading to higher tier plan

### Common Solutions

**Error: "Please try again in a moment"**
```typescript
// Increase wait time between requests
REQUEST_INTERVAL_MS: 30000,  // 30 seconds instead of 20
```

**Too many requests per minute**
```typescript
// Reduce requests per minute
MAX_REQUESTS_PER_MINUTE: 2,  // Even more conservative
```

**API timeout errors**
```typescript
// Increase timeout
REQUEST_TIMEOUT_MS: 45000,   // 45 seconds instead of 30
```

## Configuration Options

### Rate Limiting Settings
```typescript
// Conservative settings for free tier
MAX_REQUESTS_PER_MINUTE: 3,
REQUEST_INTERVAL_MS: 20000,    // 20 seconds between requests
MAX_RETRY_ATTEMPTS: 3,         // Retry failed requests 3 times
INITIAL_RETRY_DELAY_MS: 2000,  // Wait 2 seconds before first retry

// More aggressive settings for paid accounts
MAX_REQUESTS_PER_MINUTE: 15,
REQUEST_INTERVAL_MS: 5000,     // 5 seconds between requests
```

### Model Selection
```typescript
MODEL: 'gpt-3.5-turbo',        // Fast, cost-effective, good rate limits
// MODEL: 'gpt-4',             // Better quality, higher cost, stricter limits
```

### Cost Management
```typescript
MAX_TOKENS: 300,               // Limit response length = lower costs
TEMPERATURE: 0.7,              // Creativity level (0-1)
```

## Monitoring & Analytics

### Usage Tracking
- Monitor real-time API usage in component
- Track successful vs fallback response ratios
- View retry attempt statistics

### Cost Monitoring
```typescript
// In OpenAI Dashboard:
// - Set up billing alerts
// - Monitor usage by model
// - Track cost per conversation
```

### Performance Metrics
- **Response time**: ~2-5 seconds for ChatGPT
- **Fallback time**: ~1.5 seconds for local responses
- **Success rate**: >95% with proper rate limiting

## Best Practices

### For Development
1. Use demo mode initially (no API key needed)
2. Test with conservative rate limits
3. Implement proper error handling

### For Production
1. Use environment variables for API keys
2. Set up monitoring and alerts
3. Implement user feedback systems
4. Have robust fallback systems

### For Cost Control
1. Set OpenAI usage limits in dashboard
2. Use appropriate max_tokens settings
3. Monitor usage regularly
4. Consider caching common responses

## Error Handling

### Automatic Recovery
- **Rate Limits**: Automatically waits and retries
- **Network Issues**: Falls back to local responses
- **Invalid Responses**: Provides error-specific feedback
- **Timeout Errors**: Retries with exponential backoff

### User Experience
- **No Interruption**: Users always get responses
- **Clear Feedback**: Shows why delays occur
- **Progressive Enhancement**: Works offline and online

## Security Best Practices

### API Key Management
```typescript
// Development
OPENAI_API_KEY: 'sk-your-key-here'

// Production (recommended)
OPENAI_API_KEY: process.env.OPENAI_API_KEY
```

### Rate Limiting Benefits
- **Cost Protection**: Prevents runaway API costs
- **Stability**: Ensures consistent app performance
- **User Experience**: Predictable response times
- **Compliance**: Respects OpenAI's terms of service

## Support Resources

### OpenAI Documentation
- [Rate Limits Guide](https://platform.openai.com/docs/guides/rate-limits)
- [Error Codes Reference](https://platform.openai.com/docs/guides/error-codes)
- [Usage Dashboard](https://platform.openai.com/usage)

### KasiSave Integration
- Check browser console for detailed error logs
- Monitor network tab for API request/response details
- Test fallback responses work correctly

---

**Note**: The AI Coach is designed to provide value even without ChatGPT integration. The fallback responses are carefully crafted to be helpful and contextual to each user's savings situation.

## Quick Fixes for Common Issues

### Issue: "Rate limit exceeded immediately"
**Solution**: Your API key might be on free tier. Use these ultra-conservative settings:
```typescript
MAX_REQUESTS_PER_MINUTE: 1,
REQUEST_INTERVAL_MS: 60000,  // 1 minute between requests
```

### Issue: "Invalid API key"
**Solution**: 
1. Check your API key format (must start with 'sk-')
2. Verify you have billing set up in OpenAI account
3. Make sure the key hasn't expired

### Issue: "App feels slow"
**Solution**: The conservative rate limits prioritize reliability over speed. For paid accounts, you can:
```typescript
REQUEST_INTERVAL_MS: 10000,  // Reduce to 10 seconds
MAX_REQUESTS_PER_MINUTE: 10, // Increase if your plan allows
```