import mongoose from 'mongoose';
import { DB_NAME, STATUS } from '../utils/constant.js';
const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_NAME.USER,
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: DB_NAME.PRODUCT,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    shippingAddress: {
      city: { type: String, default: null },
      state: { type: String, default: null },
      country: { type: String, default: null },
      zipCode: { type: String, default: null },
      address: { type: String, default: null },
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.PENDING,
    },
  },
  { timestamps: true, versionKey: false }
);
orderSchema.index({ orderStatus: 1, userId: 1 });

export const orderModel = mongoose.model(DB_NAME.ORDER, orderSchema);
