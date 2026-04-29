import Stripe from 'stripe';
import { findOne, updateUserById } from '../services/auth.service.js';
import { PLAN_STATUS } from '../utils/constant.js';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createSubscribePlan = async (req, res) => {
  try {
    const { email, priceId } = req.body;
    const user = await findOne({ email });
    if (!user) {
      return res.fail(400, 'user not found');
    }
    if (
      user.subscriptionStatus === PLAN_STATUS.ACTIVE &&
      user.currentPeriodEnd &&
      new Date(user.currentPeriodEnd) > new Date()
    ) {
      return res.fail(400, 'Subscription plan already active');
    }
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
      });
      customerId = customer.id;
      await updateUserById(user.id, { stripeCustomerId: customerId });
    }
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/api/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cencel`,
    });
    return res.success(200, 'Checkout created', { paymentUrl: session.url });
    // return res.redirect(session.url);
  } catch (error) {
    console.log('subscribePlan API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};

export const cancelSubscription = async (req, res) => {
  const { email } = req.body;
  const user = await findOne({ email });
  if (!user.subscriptionId) return res.fail(400, 'No subscription');
  await stripe.subscriptions.cancel(user.subscriptionId);
  return res.success(200, 'Subscription will cancel at billing period end');
};

export const successSubscribePlanPayment = async (req, res) => {
  try {
    await stripe.checkout.sessions.retrieve(req.query.session_id);
    return res.send('Subscribe plan successfully');
  } catch (error) {
    console.log('successSubscribePlanPayment API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};

export const subscribeWebhook = async (req, res) => {
  try {
    let event = req.body;
    const data = event.data.object;
    let user;

    let subscription;
    if (event.type == 'checkout.session.completed') {
      subscription = await stripe.subscriptions.retrieve(data.subscription);
      user = await findOne({ stripeCustomerId: subscription.customer });
      const periodEnd = subscription.items.data[0].current_period_end;
      await updateUserById(user.id, {
        subscriptionId: data.subscription,
        subscriptionStatus: PLAN_STATUS.ACTIVE,
        currentPeriodEnd: new Date(periodEnd * 1000),
      });
      return res.success(200, 'Payment success.');
    }
    if (event.type === 'invoice.payment_succeeded') {
      subscription = await stripe.subscriptions.retrieve(data.subscription);
      user = await findOne({ stripeCustomerId: subscription.customer });
      const periodEnd = subscription.items.data[0].current_period_end;
      await updateUserById(user.id, {
        subscriptionStatus: PLAN_STATUS.ACTIVE,
        currentPeriodEnd: new Date(periodEnd * 1000),
      });
    }
    if (event.type === 'customer.subscription.updated') {
      subscription = data;
      user = await findOne({ stripeCustomerId: subscription.customer });
      const periodEnd = subscription.current_period_end;
      await updateUserById(user.id, {
        subscriptionStatus: PLAN_STATUS.ACTIVE,
        currentPeriodEnd: new Date(periodEnd * 1000),
      });
    }
    if (event.type === 'customer.subscription.deleted') {
      subscription = data;

      user = await findOne({
        stripeCustomerId: subscription.customer,
      });
      await updateUserById(user.id, {
        subscriptionId: null,
        subscriptionStatus: PLAN_STATUS.INACTIVE,
        currentPeriodEnd: null,
      });
    }
    return res.json({ received: true });
  } catch (error) {
    console.log('Webhook API Error:', error);
    return res.fail(500, 'Internal server error.');
  }
};
