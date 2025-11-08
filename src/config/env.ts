import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 3000),
  MONGODB_URI: requiredEnv(process.env.MONGODB_URI, 'MONGODB_URI'),
  JWT_SECRET: requiredEnv(process.env.JWT_SECRET, 'JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1d',
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:3000',
  SESSION_SECRET: process.env.SESSION_SECRET ?? 'change-me',
  PASSWORD_RESET_TOKEN_EXPIRES_MINUTES: Number(process.env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES ?? 30),
};


