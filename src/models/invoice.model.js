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
  { timestamps: true, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

invoiceSchema.virtual('pdfUrl').get(function () {
  if (!this.pdf) return null;
  return `${process.env.BASE_URL}/public/invoice/${this.pdf}`;
});

export const invoiceModel = mongoose.model(DB_NAME.INVOICE, invoiceSchema);
