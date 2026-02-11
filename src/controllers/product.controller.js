import path from 'path';
import fs from 'fs';
import {
  createProduct,
  updateProductById,
  deleteById,
  findAll,
  findProductById,
} from '../services/product.service.js';
import { successResponse, errorResponse } from '../utils/resUtil.js';

export const getAllProducts = async (req, res) => {
  try {
    const { limit, page } = req.query;
    const products = await findAll({}, limit, page);
    return successResponse(res, 200, 'Product list retrive successfully.', products);
  } catch (error) {
    return errorResponse(res, 500, 'Internal server error.');
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, stock, description, category } = req.body;
    const image = req.file?.filename;
    const product = await createProduct({
      name,
      image,
      price,
      stock,
      description,
      category,
    });
    if (product) {
      return successResponse(res, 201, 'Product added successfully.', product);
    }
    return errorResponse(res, 400, 'Product not added.');
  } catch (error) {
    return errorResponse(res, 500, 'Internal server error.');
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, stock, description, category } = req.body;
    const newImage = req.file?.filename;
    const product = await findProductById(productId, { id: 1, image: 1 });
    if (!product) {
      return errorResponse(res, 404, 'Product not found.');
    }
    if (newImage && product.image) {
      const oldImagePath = path.join(__dirname, '../public', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) return console.log('Failed to delete old image:', err);
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
    return successResponse(res, 200, 'Prouct details updated successfully.', updatedProduct);
  } catch (error) {
    return errorResponse(res, 500, 'Internal server error.');
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await findProductById(productId, { id: 1 });
    if (!product) {
      return errorResponse(res, 404, 'Product not found.');
    }
    await deleteById(productId);
    return successResponse(res, 200, 'Product deleted successfully.');
  } catch (error) {
    return errorResponse(res, 500, 'Internal server error.');
  }
};
