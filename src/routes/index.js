import express from 'express';
const route = express.Router();
import authRoute from './auth.route.js';
import userRoute from './user.route.js';
import productRoute from './product.route.js';
import orderRoute from './order.route.js';
import paymentRoute from './payment.route.js';
import messageRoute from './message.route.js';
import invoiceGenerateRoute from './invoice.route.js';

route.use('/auth', authRoute);
route.use('/user', userRoute);
route.use('/product', productRoute);
route.use('/order', orderRoute);
route.use('/payment', paymentRoute);
route.use('/message', messageRoute);
route.use('/invoice', invoiceGenerateRoute);

export default route;
