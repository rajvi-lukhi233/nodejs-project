const mongoose = require("mongoose");
const { messageModel } = require("../models/message.model");

exports.createMessage = (data) => {
  return messageModel.create(data);
};

exports.findAllMessage = (userId) => {
  return messageModel
    .find({
      $or: [
        { senderId: new mongoose.Types.ObjectId(userId) },
        { receiverId: new mongoose.Types.ObjectId(userId) },
      ],
    })
    .populate({ path: "senderId", select: "name" })
    .populate({
      path: "receiverId",
      select: "name",
    });
};
