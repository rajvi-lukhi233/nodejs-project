import Stripe from 'stripe';
import { createCoupon, findCoupon } from '../services/coupon.service.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeCoupon = async (req, res) => {
  try {
    const { name, code, discountType, discountValue } = req.body;
    const stripeCoupon = await stripe.coupons.create(
      discountType == 'percent'
        ? { percent_off: discountValue, duration: 'once' }
        : { amount_off: discountValue, duration: 'once' }
    );
    const promotionCode = await stripe.promotionCodes.create({
      promotion: {
        type: 'coupon',
        coupon: stripeCoupon.id,
      },
      code: code,
    });
    const coupon = await createCoupon({
      name,
      code,
      discountType,
      discountValue,
      stripePromotionCodeId: promotionCode.id,
    });
    return res.success(201, 'Coupon created successfully', coupon);
  } catch (error) {
    console.log('CreateStripeCoupon API Error:', error);
    return res.fail(500, 'Internal server error');
  }
};

export const getAllCoupon = async (req, res) => {
  try {
    const coupons = await findCoupon({ active: true });
    return res.success(200, 'Coupons retrives successfully', coupons);
  } catch (error) {
    console.log('getAllCoupon API Error:', error);
    return res.fail(500, 'Internal server error');
  }
};
