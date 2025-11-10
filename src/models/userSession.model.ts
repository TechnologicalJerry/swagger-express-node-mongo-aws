import { Schema, model, models, Document, Model } from 'mongoose';

export type SessionStatus = 'logged_in' | 'logged_out';

export interface UserSessionAttributes {
  sessionId: string;
  userId: string;
  email: string;
  status: SessionStatus;
  loggedInAt: Date;
  loggedOutAt?: Date | null;
}

export interface UserSessionDocument extends UserSessionAttributes, Document {
  createdAt: Date;
  updatedAt: Date;
}

const UserSessionSchema = new Schema<UserSessionDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['logged_in', 'logged_out'],
      default: 'logged_in',
    },
    loggedInAt: {
      type: Date,
      required: true,
    },
    loggedOutAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const UserSession: Model<UserSessionDocument> =
  (models.UserSession as Model<UserSessionDocument>) ||
  model<UserSessionDocument>('UserSession', UserSessionSchema);


