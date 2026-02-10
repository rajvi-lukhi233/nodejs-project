const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const {
  createCheckoutPayment,
  webhook,
  getPaymentList,
} = require('../controllers/payment.controller');
const route = express.Router();

route
  .get('/', auth, getPaymentList)
  .post('/create-chekcout-payment', auth, createCheckoutPayment)
  .post('/webhook', webhook);

module.exports = route;
