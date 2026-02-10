const express = require('express');
const { validation } = require('../middleware/validationMiddleware');
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require('../controllers/product.controller');
const {
  productSchemaValidation,
  updateProductSchemaValidation,
  deleteProductSchemaValidation,
} = require('../validation/product.validation');
const { upload } = require('../utils/multer');
const { auth, authRole } = require('../middleware/authMiddleware');
const { ROLE } = require('../utils/constant');
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

module.exports = route;
