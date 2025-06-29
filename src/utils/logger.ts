// Secure Logger - Only logs in development mode
class SecureLogger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  log(...args: any[]) {
    if (this.isDevelopment) {
      console.log(...args);
    }
  }

  error(...args: any[]) {
    if (this.isDevelopment) {
      console.error(...args);
    }
  }

  warn(...args: any[]) {
    if (this.isDevelopment) {
      console.warn(...args);
    }
  }

  info(...args: any[]) {
    if (this.isDevelopment) {
      console.info(...args);
    }
  }

  debug(...args: any[]) {
    if (this.isDevelopment) {
      console.debug(...args);
    }
  }

  table(data: any) {
    if (this.isDevelopment && console.table) {
      console.table(data);
    }
  }

  group(label: string) {
    if (this.isDevelopment && console.group) {
      console.group(label);
    }
  }

  groupEnd() {
    if (this.isDevelopment && console.groupEnd) {
      console.groupEnd();
    }
  }

  // For production monitoring - only log critical errors
  critical(message: string, error?: any) {
    // In production, you might want to send this to an error tracking service
    // like Sentry, LogRocket, etc.
    if (!this.isDevelopment && this.isClient) {
      // Send to error tracking service here
      // Example: Sentry.captureException(error);
    } else {
      console.error('CRITICAL:', message, error);
    }
  }
}

// Export singleton instance
export const logger = new SecureLogger();

// Export for backward compatibility
export default logger; 