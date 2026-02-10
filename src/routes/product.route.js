import express from 'express';
import { validation } from '../middleware/validationMiddleware.js';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} from '../controllers/product.controller.js';
import {
  productSchemaValidation,
  updateProductSchemaValidation,
  deleteProductSchemaValidation,
} from '../validation/product.validation.js';
import { upload } from '../utils/multer.js';
import { auth, authRole } from '../middleware/authMiddleware.js';
import { ROLE } from '../utils/constant.js';
const route = express.Router();

route
  .get('/', auth, getAllProducts)
  .post(
    '/addProduct',
    auth,
    authRole(ROLE.ADMIN),
    upload.single('image'),
    validation(productSchemaValidation),
    addProduct
  )
  .put(
    '/:productId',
    auth,
    authRole(ROLE.ADMIN),
    upload.single('image'),
    validation(updateProductSchemaValidation),
    updateProduct
  )
  .delete(
    '/:productId',
    auth,
    authRole(ROLE.ADMIN),
    validation(deleteProductSchemaValidation),
    deleteProduct
  );

export default route;
