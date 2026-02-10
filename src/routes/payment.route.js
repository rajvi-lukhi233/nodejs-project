import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import {
  createCheckoutPayment,
  webhook,
  getPaymentList,
} from '../controllers/payment.controller.js';
const route = express.Router();

route
  .get('/', auth, getPaymentList)
  .post('/create-chekcout-payment', auth, createCheckoutPayment)
  .post('/webhook', webhook);

export default route;
