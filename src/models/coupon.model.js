import mongoose from 'mongoose';
import { DB_NAME } from '../utils/constant.js';
const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    code: {
      type: String,
      default: null,
    },
    discountType: {
      type: String,
    },
    discountValue: {
      type: Number,
    },
    stripePromotionCodeId: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

export const couponModel = mongoose.model(DB_NAME.COUPON, couponSchema);
