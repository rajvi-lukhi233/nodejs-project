import mongoose from 'mongoose';
import { DB_NAME } from '../utils/constant.js';
const invoiceSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    pdf: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

export const invoiceModel = mongoose.model(DB_NAME.INVOICE, invoiceSchema);
