import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

const mapReadyStateToText = (state: number): string => {
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
};

export const connectDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    logger.debug('MongoDB connection already established');
    return mongoose;
  }

  logger.info(`Connecting to MongoDB (${mapReadyStateToText(mongoose.connection.readyState)})`);

  try {
    const connection = await mongoose.connect(env.MONGODB_URI);
    logger.info('MongoDB connected successfully');
    return connection;
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed');
  }
};


