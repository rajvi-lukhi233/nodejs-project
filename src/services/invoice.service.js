import mongoose from 'mongoose';
import { invoiceModel } from '../models/invoice.model.js';

export const createInvoice = (data) => {
  return invoiceModel.create(data);
};

export const findInvoice = (orderId, option) => {
  return invoiceModel.findOne({ orderId: new mongoose.Types.ObjectId(orderId) }, option);
};
