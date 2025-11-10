import { Request, Response, NextFunction } from 'express';
import { userService, PublicUser } from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response.util';
import { logger } from '../config/logger';
import { sessionService } from '../services/session.service';

export class AuthController {
  private async establishSession(req: Request, user: PublicUser): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!req.session) {
        reject(new Error('Session middleware is not configured'));
        return;
      }

      req.session.regenerate((regenerateError) => {
        if (regenerateError) {
          reject(regenerateError);
          return;
        }

        (async () => {
          try {
            req.session.userId = user.id;
            req.session.email = user.email;
            req.session.user = {
              id: user.id,
              email: user.email,
            };
            req.session.status = 'logged_in';

            const sessionRecord = await sessionService.recordLogin({
              sessionId: req.sessionID,
              user,
            });
            if (sessionRecord) {
              req.session.userSessionId = sessionRecord.id;
            }

            req.session.save((saveError) => {
              if (saveError) {
                reject(saveError);
                return;
              }
              resolve();
            });
          } catch (error) {
            reject(error);
          }
        })();
      });
    });
  }

  private async updateSessionOnLogout(req: Request): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (!req.session) {
        resolve();
        return;
      }

      req.session.status = 'logged_out';

      sessionService
        .recordLogout({ sessionId: req.sessionID })
        .catch((error) => logger.error('Failed to record logout session', { error }));

      req.session.save((saveError) => {
        if (saveError) {
          reject(saveError);
          return;
        }
        resolve();
      });
    });
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        userName,
        gender,
        dob,
        phone,
      } = req.body;

      if (password !== confirmPassword) {
        sendError(res, 'Passwords do not match', 400);
        return;
      }

      const result = await userService.register({
        email,
        password,
        firstName,
        lastName,
        userName,
        gender,
        dob,
        phone,
      });

      sendSuccess(res, { user: result.user, token: result.token }, 'User registered successfully', 201);
    } catch (error) {
      logger.error('Register error', error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await userService.login({ email, password });
      await this.establishSession(req, result.user);

      sendSuccess(res, { user: result.user, token: result.token }, 'Login successful');
    } catch (error) {
      logger.error('Login error', error);
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'User not authenticated', 401);
        return;
      }

      const user = await userService.getUserById(req.user.userId);
      if (!user) {
        sendError(res, 'User not found', 404);
        return;
      }

      sendSuccess(res, user, 'Profile retrieved successfully');
    } catch (error) {
      logger.error('Get profile error', error);
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      const { resetToken } = await userService.requestPasswordReset({ email });

      const responseData =
        resetToken.length > 0
          ? {
            resetToken,
            message: 'Use the provided token to reset the password.',
          }
          : {
            message: 'If an account exists for the provided email, a reset token has been generated.',
          };

      sendSuccess(res, responseData, 'Password reset requested');
    } catch (error) {
      logger.error('Forgot password error', error);
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        sendError(res, 'Passwords do not match', 400);
        return;
      }

      await userService.resetPassword({ token, password });

      sendSuccess(res, null, 'Password reset successfully');
    } catch (error) {
      logger.error('Reset password error', error);
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.updateSessionOnLogout(req);
      res.clearCookie('connect.sid');
      sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      logger.error('Logout error', error);
      next(error);
    }
  }
}

export const authController = new AuthController();
