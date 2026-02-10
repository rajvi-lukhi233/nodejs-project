const express = require('express');
const route = express.Router();
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const productRoute = require('./product.route');
const orderRoute = require('./order.route');
const paymentRoute = require('./payment.route');
const messageRoute = require('./message.route');

route.use('/auth', authRoute);
route.use('/user', userRoute);
route.use('/product', productRoute);
route.use('/order', orderRoute);
route.use('/payment', paymentRoute);
route.use('/message', messageRoute);

module.exports = route;
