import express from 'express';
import { auth, authRole } from '../middleware/authMiddleware.js';
import {
  craeteOrder,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getUserWiseOrder,
} from '../controllers/order.controller.js';
import { validation } from '../middleware/validationMiddleware.js';
import {
  createOrderSchemaValidation,
  updateOrderSchemaValidation,
  deleteOrderSchemaValidation,
} from '../validation/order.validation.js';
import { ROLE } from '../utils/constant.js';
const route = express.Router();

route
  .get('/', auth, getAllOrders)
  .get('/getUserWiseOrder', auth, authRole(ROLE.ADMIN), getUserWiseOrder)
  .post('/', auth, validation(createOrderSchemaValidation), craeteOrder)
  .put('/:orderId', auth, validation(updateOrderSchemaValidation), updateOrder)
  .delete('/:orderId', auth, validation(deleteOrderSchemaValidation), deleteOrder);

export default route;
