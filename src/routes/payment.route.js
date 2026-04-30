import express from 'express';
import { auth, authRole } from '../middleware/authMiddleware.js';
import {
  createCheckoutPayment,
  webhook,
  getPaymentList,
  refundsPayment,
} from '../controllers/payment.controller.js';
import { ROLE } from '../utils/constant.js';
const route = express.Router();

route
  .get('/', auth, getPaymentList)
  .post('/create-chekcout-payment', auth, createCheckoutPayment)
  .post('/refunds', auth, authRole(ROLE.ADMIN), refundsPayment)
  .post('/webhook', webhook);

export default route;
