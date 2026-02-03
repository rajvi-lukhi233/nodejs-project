const mongoose = require("mongoose");
const { DB_NAME } = require("../utils/constant");
const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: DB_NAME.USER,
    required: true,
  },
  product: [
    {
      // productId:
    },
  ],
});

exports.orderModel = mongoose.model(DB_NAME.ORDER, orderSchema);
