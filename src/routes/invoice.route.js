import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { downloadInvoice, generateInvoice } from '../controllers/invoiceController.js';
const route = express.Router();

route.post('/generateInvoice', auth, generateInvoice);
route.get('/downloadInvoice/:orderId', auth, downloadInvoice);

export default route;
