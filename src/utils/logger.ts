/**
 * Simple logger utility for centralized logging.
 * Can be extended to send logs to external services (Sentry, Crashlytics).
 */
export const logger = {
  log: (...args: any[]) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (__DEV__) {
      console.warn(...args);
    }
    // Note: In production, integrate with monitoring service (e.g., Sentry, Crashlytics)
  },
  error: (...args: any[]) => {
    // Always log errors, even in production (for now, until external service is set up)
    console.error(...args);
    // Note: In production, integrate with error tracking (e.g., Sentry, Crashlytics)
  },
  info: (...args: any[]) => {
     if (__DEV__) {
      console.info(...args);
    }
  }
};
