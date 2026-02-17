import Stripe from 'stripe';
import { STATUS } from '../utils/constant.js';
import { findOrderById, updateById } from '../services/order.service.js';
import { create, updatePayment, findPayment, paymentList } from '../services/payment.service.js';
// import { findOne, updateUserById } from '../services/auth.service.js';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const getPaymentList = async (req, res) => {
  try {
    const payment = await paymentList();
    if (!paymentList) {
      return res.fail(400, 'Payments not found.');
    }
    return res.success(200, 'payment list retrive successfully.', payment);
  } catch (error) {
    console.log('GetPaymentList API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};

export const createCheckoutPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await findOrderById(orderId);
    const { userId } = req.user;
    //1. checking is existing order
    if (!order) {
      return res.fail(400, 'Order not found');
    }
    //2. checking is payment already done or not
    const payment = await findPayment(
      { orderId: orderId, paymentStatus: STATUS.COMPLETED },
      { id: 1 }
    );
    if (payment) {
      return res.fail(400, 'Payment already done.');
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

    //3. create checout session for payment
    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      metadata: { orderId: order._id.toString(), userId: userId.toString() },
    });

    //4. create payment
    await create({ userId, orderId, amount: order.totalAmount });
    return res.success(200, 'Payment created successfully.', {
      paymentUrl: checkout.url,
    });
  } catch (error) {
    console.log('CreateCheckoutPayment API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};

//-----------using payment-intenet-method--------------------//

// export const createPaymentIntent = async (req, res) => {
//   try {
//     const { orderId } = req.body;
//     const { userId } = req.user;
//     const order = await findOrderById(orderId);
//     if (!order) {
//       return res.fail(400, "Order not found");
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
//     return res.fail(500, "Internal server error.");
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
      return res.success(200, 'Payment success.');
    }
    if (event.type == 'checkout.session.async_payment_failed') {
      // if (event.type === "payment_intent.payment_failed") {
      await updateById(orderId, { orderStatus: STATUS.FAILED });
      await updatePayment({ orderId: orderId }, { paymentStatus: STATUS.FAILED });
      return res.fail(400, 'Payment faild');
    }
  } catch (error) {
    console.log('Webhook API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};
