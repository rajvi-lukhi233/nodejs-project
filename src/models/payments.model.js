const mongoose = require('mongoose');
const { DB_NAME, STATUS } = require('../utils/constant');
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

exports.paymentModel = mongoose.model(DB_NAME.PAYMENT, paymentSchema);
