import mongoose from 'mongoose';
import { DB_NAME, PROVIDER, ROLE } from '../utils/constant.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    otpCode: {
      type: String,
      default: null,
    },
    otpExpiredAt: {
      type: Date,
      default: null,
    },
    resetPassToken: {
      type: String,
      default: null,
    },
    resetPassTokenExpiredAt: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyToken: {
      type: String,
      default: null,
    },
    twoFactorSecret: {
      type: String,
      default: null,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: Object.values(PROVIDER),
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

export const userModel = mongoose.model(DB_NAME.USER, userSchema);
