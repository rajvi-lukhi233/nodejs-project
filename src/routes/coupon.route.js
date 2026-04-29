import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { createStripeCoupon, getAllCoupon } from '../controllers/coupon.controller.js';
const route = express.Router();

route.post('/create', createStripeCoupon);
route.get('/getAllCoupon', getAllCoupon);

export default route;
