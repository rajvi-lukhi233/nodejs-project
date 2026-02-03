const { productModel } = require("../models/products.model");

exports.createProduct = (data) => {
  return productModel.create(data);
};

exports.updateProductById = (id, data) => {
  return productModel.findByIdAndUpdate(id, data, { new: true });
};

exports.findProductById = (id, option) => {
  return productModel.findById(id, option);
};

exports.deleteById = (id) => {
  return productModel.findByIdAndDelete(id);
};

exports.findAll = (filter) => {
  return productModel.find(filter);
};
