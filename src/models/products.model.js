import mongoose from 'mongoose';
import { DB_NAME } from '../utils/constant.js';
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
  { timestamps: true, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual('imageUrl').get(function () {
  if (!this.image) return null;
  return `${process.env.BASE_URL}/public/${this.image}`;
});

export const productModel = mongoose.model(DB_NAME.PRODUCT, productSchema);
