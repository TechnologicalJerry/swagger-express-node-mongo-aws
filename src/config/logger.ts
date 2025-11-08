type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const formatMessage = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serialiseError = (error: unknown): any => {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack };
  }

  return error;
};

export const logger = {
  info(message: string, meta?: unknown): void {
    if (meta !== undefined) {
      console.info(formatMessage('info', message), serialiseError(meta));
      return;
    }
    console.info(formatMessage('info', message));
  },
  warn(message: string, meta?: unknown): void {
    if (meta !== undefined) {
      console.warn(formatMessage('warn', message), serialiseError(meta));
      return;
    }
    console.warn(formatMessage('warn', message));
  },
  error(message: string, meta?: unknown): void {
    if (meta !== undefined) {
      console.error(formatMessage('error', message), serialiseError(meta));
      return;
    }
    console.error(formatMessage('error', message));
  },
  debug(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      if (meta !== undefined) {
        console.debug(formatMessage('debug', message), serialiseError(meta));
        return;
      }
      console.debug(formatMessage('debug', message));
    }
  },
};


