import express from 'express';
import {
  cancelSubscription,
  createSubscribePlan,
  subscribeWebhook,
  successSubscribePlanPayment,
} from '../controllers/subscribe.controller.js';
const route = express.Router();

route.post('/create', createSubscribePlan);
route.post('/cancel', cancelSubscription);
route.get('/success', successSubscribePlanPayment);
route.post('/webhook', subscribeWebhook);

export default route;
