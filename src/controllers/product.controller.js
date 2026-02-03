const { createProduct } = require("../services/product.service");
const { successResponse, errorResponse } = require("../utils/resUtil");

exports.addProduct = async (req, res) => {
  try {
    const { name, price, stock, description, category } = req.body;
    const image = req.file.filename;
    const product = await createProduct({
      name,
      image,
      price,
      stock,
      description,
      category,
    });
    if (product) {
      return successResponse(res, 201, "Product added successfully", product);
    }
    return errorResponse(res, 400, "Product not added");
  } catch (error) {
    console.log("Somthing want wrong please try again", error);
    return errorResponse(res, 500, "Internal server error");
  }
};
