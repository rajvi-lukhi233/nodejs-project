const path = require("path");
const fs = require("fs");
const {
  createProduct,
  updateProductById,
  deleteById,
  findAll,
  findProductById,
} = require("../services/product.service");
const { successResponse, errorResponse } = require("../utils/resUtil");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await findAll();
    if (!products) {
      return errorResponse(res, 404, "Products not found.");
    }
    return successResponse(
      res,
      200,
      "Product list retrive successfully.",
      products,
    );
  } catch (error) {
    console.log("Somthing want wrong please try again.", error);
    return errorResponse(res, 500, "Internal server error.");
  }
};

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
      return successResponse(res, 201, "Product added successfully.", product);
    }
    return errorResponse(res, 400, "Product not added.");
  } catch (error) {
    console.log("Somthing want wrong please try again.", error);
    return errorResponse(res, 500, "Internal server error.");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, stock, description, category } = req.body;
    const newImage = req.file?.filename;
    const product = await findProductById(productId, { id: 1, image: 1 });
    if (!product) {
      return errorResponse(res, 404, "Product not found.");
    }
    if (newImage && product.image) {
      const oldImagePath = path.join(__dirname, "../public", product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) return console.log("Failed to delete old image:", err);
        });
      }
    }
    const updatedProduct = await updateProductById(productId, {
      name,
      price,
      stock,
      description,
      category,
      image: newImage,
    });
    return successResponse(
      res,
      200,
      "Prouct details updated successfully.",
      updatedProduct,
    );
  } catch (error) {
    console.log("Somthing want wrong please try again.", error);
    return errorResponse(res, 500, "Internal server error.");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await findProductById(productId, { id: 1 });
    if (!product) {
      return errorResponse(res, 404, "Product not found.");
    }
    await deleteById(productId);
    return successResponse(res, 200, "Product deleted successfully.");
  } catch (error) {
    console.log("Somthing want wrong please try again.", error);
    return errorResponse(res, 500, "Internal server error.");
  }
};
