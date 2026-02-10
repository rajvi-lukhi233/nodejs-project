import mongoose from 'mongoose';
import { DB_NAME } from '../utils/constant.js';

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      default: null,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_NAME.USER,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DB_NAME.USER,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const messageModel = mongoose.model(DB_NAME.MESSAGE, messageSchema);
