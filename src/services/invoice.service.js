import mongoose from 'mongoose';
import { invoiceModel } from '../models/invoice.model.js';

export const createInvoice = (data) => {
  return invoiceModel.create(data);
};

export const findInvoice = (orderId) => {
  return invoiceModel.findOne(
    { orderId: new mongoose.Types.ObjectId(orderId) },
    {
      pdf: {
        $concat: [process.env.BASE_URL + '/public/invoice/', '$pdf'],
      },
    }
  );
};
