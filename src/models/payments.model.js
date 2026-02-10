import mongoose from 'mongoose';
import { DB_NAME, STATUS } from '../utils/constant.js';
const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_NAME.USER,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_NAME.ORDER,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);

paymentSchema.index({ userId: 1, paymentStatus: 1 });

export const paymentModel = mongoose.model(DB_NAME.PAYMENT, paymentSchema);
