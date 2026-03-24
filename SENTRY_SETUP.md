# Sentry Error Tracking Setup

Sentry is now integrated for production error tracking and performance monitoring.

## Setup Instructions

### 1. Create Sentry Account

1. Go to [sentry.io](https://sentry.io) and sign up
2. Create a new project for "Node.js"
3. Copy your DSN (Data Source Name)

### 2. Add Environment Variable

Add to your `.env` file or server environment:

```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### 3. Initialize on Server Startup

The Sentry integration is ready but needs to be initialized. Add to `src/index.ts`:

```typescript
import { initSentry } from "./lib/sentry.js";

// Initialize Sentry before starting the server
initSentry();

app.listen(port, async (err) => {
  // ... rest of startup code
});
```

### 4. Update Business Logger (Optional)

To send critical errors to Sentry, update `businessLogger.businessError`:

```typescript
import { captureException } from "./sentry.js";

businessError(data) {
  logger.error({...});
  
  // Also send to Sentry
  captureException(data.error, {
    userId: data.userId,
    username: data.username,
    event: data.event,
    ...data.context,
  });
}
```

## Features

### Backend Error Tracking
- Automatic exception capture
- Performance monitoring (10% sample rate in production)
- Profiling (10% sample rate in production)
- Sensitive data filtering (auth headers, tokens)
- User context tracking

### Frontend Error Tracking
- React ErrorBoundary integration
- Component stack traces
- Automatic error reporting

## Testing

Test error tracking:

```bash
# Backend test
curl http://localhost:8080/api/test-error

# Frontend test
# Trigger an error in the UI and check Sentry dashboard
```

## Benefits

1. **Proactive Monitoring**: Catch errors before users report them
2. **Debug Faster**: Full stack traces and context
3. **Performance Insights**: Identify slow endpoints
4. **User Impact**: See how many users are affected
5. **Release Tracking**: Monitor error rates per deployment

## Cost

- Free tier: 5,000 errors/month
- Should be sufficient for small to medium projects
- Upgrade if needed for higher volume

## Privacy

Sentry integration filters:
- Authorization headers
- Cookies
- API keys and tokens
- Query parameters with sensitive data

User data sent:
- User ID
- Username
- No passwords or sensitive personal data
