const mongoose = require('mongoose');
const { DB_NAME } = require('../utils/constant');

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

exports.messageModel = mongoose.model(DB_NAME.MESSAGE, messageSchema);
