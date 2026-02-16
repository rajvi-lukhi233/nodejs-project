import Stripe from 'stripe';
import { STATUS } from '../utils/constant.js';
import { findOrderById, updateById } from '../services/order.service.js';
import { create, updatePayment, findPayment, paymentList } from '../services/payment.service.js';
import { errorResponse, successResponse } from '../utils/resUtil.js';
// import { findOne, updateUserById } from '../services/auth.service.js';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const getPaymentList = async (req, res) => {
  try {
    const payment = await paymentList();
    if (!paymentList) {
      return errorResponse(res, 400, 'Payments not found.');
    }
    return successResponse(res, 200, 'payment list retrive successfully.', payment);
  } catch (error) {
    console.log('GetPaymentList API Error:', error);
    return errorResponse(res, 500, 'Internal server error.');
  }
};

export const createCheckoutPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await findOrderById(orderId);
    const { userId } = req.user;
    if (!order) {
      return errorResponse(res, 400, 'Order not found');
    }
    const payment = await findPayment(
      { orderId: orderId, paymentStatus: STATUS.COMPLETED },
      { id: 1 }
    );
    if (payment) {
      return errorResponse(res, 400, 'Payment already done.');
    }
    const line_items = order.products.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.productId.name,
        },
        unit_amount: Math.round(item.productId.price * 100),
      },
      quantity: item.quantity,
    }));
    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      metadata: { orderId: order._id.toString(), userId: userId.toString() },
    });
    await create({ userId, orderId, amount: order.totalAmount });
    return successResponse(res, 200, 'Payment created successfully.', {
      paymentUrl: checkout.url,
    });
  } catch (error) {
    console.log('CreateCheckoutPayment API Error:', error);
    return errorResponse(res, 500, 'Internal server error.');
  }
};

//-----------using payment-intenet-method--------------------//

// export const createPaymentIntent = async (req, res) => {
//   try {
//     const { orderId } = req.body;
//     const { userId } = req.user;
//     const order = await findOrderById(orderId);
//     if (!order) {
//       return errorResponse(res, 400, "Order not found");
//     }
//     const amount = Math.round(order.totalAmount * 100);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       payment_method_types: ["card"],
//       metadata: {
//         orderId: order._id.toString(),
//         userId: userId.toString(),
//       },
//     });
//     console.log("paymentIntent==>", paymentIntent);
//     return successResponse(res, 200, "Payment intent created", {
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.log("Somthing want wrong please try again.", error);
//     return errorResponse(res, 500, "Internal server error.");
//   }
// };

export const webhook = async (req, res) => {
  try {
    let event = req.body;
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    if (event.type == 'checkout.session.completed') {
      // if (event.type === "payment_intent.succeeded") {

      await updateById(orderId, {
        orderStatus: STATUS.COMPLETED,
      });
      await updatePayment({ orderId: orderId }, { paymentStatus: STATUS.COMPLETED });
      return successResponse(res, 200, 'Payment success.');
    }
    if (event.type == 'checkout.session.async_payment_failed') {
      // if (event.type === "payment_intent.payment_failed") {
      await updateById(orderId, { orderStatus: STATUS.FAILED });
      await updatePayment({ orderId: orderId }, { paymentStatus: STATUS.FAILED });
      return errorResponse(res, 400, 'Payment faild');
    }
  } catch (error) {
    console.log('Webhook API Error:', error);
    return errorResponse(res, 500, 'Internal server error.');
  }
};
