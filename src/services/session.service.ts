import { logger } from '../config/logger';
import { UserSession, UserSessionDocument, SessionStatus } from '../models/userSession.model';
import { PublicUser } from './user.service';

interface RecordLoginParams {
  sessionId: string;
  user: PublicUser;
}

interface RecordLogoutParams {
  sessionId: string;
}

class SessionService {
  async recordLogin({ sessionId, user }: RecordLoginParams): Promise<UserSessionDocument | null> {
    try {
      if (!sessionId) {
        return null;
      }

      const now = new Date();
      return await UserSession.findOneAndUpdate(
        { sessionId },
        {
          $set: {
            sessionId,
            userId: user.id,
            email: user.email,
            status: 'logged_in' satisfies SessionStatus,
            loggedInAt: now,
            loggedOutAt: null,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    } catch (error) {
      logger.error('Failed to record login session', { error, sessionId, userId: user.id });
      return null;
    }
  }

  async recordLogout({ sessionId }: RecordLogoutParams): Promise<UserSessionDocument | null> {
    try {
      if (!sessionId) {
        return null;
      }

      return await UserSession.findOneAndUpdate(
        { sessionId },
        {
          $set: {
            status: 'logged_out' satisfies SessionStatus,
            loggedOutAt: new Date(),
          },
        },
        { new: true }
      );
    } catch (error) {
      logger.error('Failed to record logout session', { error, sessionId });
      return null;
    }
  }
}

export const sessionService = new SessionService();


