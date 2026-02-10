const mongoose = require('mongoose');
const { DB_NAME } = require('../utils/constant');
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: null,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

exports.productModel = mongoose.model(DB_NAME.PRODUCT, productSchema);
