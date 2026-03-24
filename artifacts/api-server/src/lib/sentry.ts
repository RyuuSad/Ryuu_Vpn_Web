import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { logger } from "./logger.js";

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export function initSentry() {
  const dsn = process.env.SENTRY_DSN;
  
  if (!dsn) {
    logger.warn("SENTRY_DSN not configured - error tracking disabled");
    return;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || "development",
    
    // Set sample rate for performance monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    // Set sample rate for profiling
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    
    integrations: [
      // Add profiling integration
      nodeProfilingIntegration(),
    ],
    
    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["cookie"];
      }
      
      // Remove sensitive query params
      if (event.request?.query_string) {
        const params = new URLSearchParams(event.request.query_string);
        if (params.has("token")) params.delete("token");
        if (params.has("api_key")) params.delete("api_key");
        event.request.query_string = params.toString();
      }
      
      return event;
    },
  });

  logger.info("Sentry error tracking initialized");
}

/**
 * Capture exception with additional context
 */
export function captureException(error: Error, context?: Record<string, unknown>) {
  if (context) {
    Sentry.setContext("additional", context);
  }
  Sentry.captureException(error);
}

/**
 * Capture message with level
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = "info") {
  Sentry.captureMessage(message, level);
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; username: string; email?: string }) {
  Sentry.setUser({
    id: user.id,
    username: user.username,
    email: user.email,
  });
}

/**
 * Clear user context
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, category: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: "info",
  });
}
