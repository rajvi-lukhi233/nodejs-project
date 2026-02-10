import mongoose from 'mongoose';
import { messageModel } from '../models/message.model.js';

export const createMessage = (data) => {
  return messageModel.create(data);
};

export const findAllMessage = (userId) => {
  return messageModel
    .find({
      $or: [
        { senderId: new mongoose.Types.ObjectId(userId) },
        { receiverId: new mongoose.Types.ObjectId(userId) },
      ],
    })
    .populate({ path: 'senderId', select: 'name' })
    .populate({
      path: 'receiverId',
      select: 'name',
    });
};
