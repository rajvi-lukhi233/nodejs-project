const { productModel } = require("../models/products.model");

exports.createProduct = (data) => {
  return productModel.create(data);
};
