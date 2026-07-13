import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISubscription {
  plan: 'none' | 'trial' | 'lifetime';
  status: 'inactive' | 'active' | 'expired';
  trialStartDate?: Date;
  trialEndDate?: Date;
  paymentDate?: Date;
  paymentAmount?: number;
  paymentTransactionId?: string;
  paymentEmail?: string;
  paymentSource?: 'stripe' | 'apple' | 'manual';
  appleTransactionId?: string;
  appleOriginalTransactionId?: string;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  phoneNumber: string;
  email?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    company?: string;
    title?: string;
    linkedIn?: string;
    website?: string;
    dateOfBirth?: string;
    hobbies?: string[];
    openToReferrals?: boolean;
    referralNotes?: string;
    idealClients?: string[];
  };
  subscription: ISubscription;
  additionalPhones: { value: string; label: string; isPrimary: boolean }[];
  additionalEmails: { value: string; label: string; isPrimary: boolean }[];
  followUpTemplate?: string;
  followUpSubject?: string;
  followUpSignatureImage?: string;
  expoPushTokens: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    phoneNumber: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    isPhoneVerified: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    profile: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      avatar: { type: String },
      company: { type: String, trim: true },
      title: { type: String, trim: true },
      linkedIn: { type: String, trim: true },
      website: { type: String, trim: true },
      dateOfBirth: { type: String, trim: true },
      hobbies: { type: [String], default: [] },
      openToReferrals: { type: Boolean },
      referralNotes: { type: String, trim: true },
      idealClients: { type: [String], default: [] },
    },
    subscription: {
      plan: { type: String, enum: ['none', 'trial', 'lifetime'], default: 'none' },
      status: { type: String, enum: ['inactive', 'active', 'expired'], default: 'inactive' },
      trialStartDate: { type: Date },
      trialEndDate: { type: Date },
      paymentDate: { type: Date },
      paymentAmount: { type: Number },
      paymentTransactionId: { type: String },
      paymentEmail: { type: String },
      paymentSource: { type: String, enum: ['stripe', 'apple', 'manual'] },
      appleTransactionId: { type: String },
      appleOriginalTransactionId: { type: String },
    },
    additionalPhones: [
      {
        value: { type: String, required: true, trim: true },
        label: { type: String, default: 'Mobile', trim: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    additionalEmails: [
      {
        value: { type: String, required: true, lowercase: true, trim: true },
        label: { type: String, default: 'Personal', trim: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    followUpTemplate: { type: String, trim: true },
    followUpSubject: { type: String, trim: true },
    followUpSignatureImage: { type: String, trim: true },
    expoPushTokens: { type: [String], default: [] },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);
