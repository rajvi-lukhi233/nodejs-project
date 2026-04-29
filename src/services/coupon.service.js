import { couponModel } from '../models/coupon.model.js';

export const createCoupon = (data) => {
  return couponModel.create(data);
};

export const findCoupon = (filter) => {
  return couponModel.find(filter);
};

export const findOneCoupon = (filter) => {
  return couponModel.findOne(filter);
};
