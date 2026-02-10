import { productModel } from '../models/products.model.js';

export const createProduct = (data) => {
  return productModel.create(data);
};

export const updateProductById = (id, data) => {
  return productModel.findByIdAndUpdate(id, data, { new: true });
};

export const findProductById = (id, option) => {
  return productModel.findById(id, option);
};

export const deleteById = (id) => {
  return productModel.findByIdAndDelete(id);
};

export const findAll = (filter, limit = 10, page = 1) => {
  const skip = (page - 1) * limit;
  return productModel.find(filter).limit(limit).skip(skip);
};
