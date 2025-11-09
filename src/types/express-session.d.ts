import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    email?: string;
    status?: 'logged_in' | 'logged_out';
    user?: {
      id: string;
      email: string;
    };
  }
}

