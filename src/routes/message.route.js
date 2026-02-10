import express from 'express';
import { auth } from '../middleware/authMiddleware.js';
import { getMessageList } from '../controllers/message.controller.js';
const route = express.Router();

route.get('/messageList', auth, getMessageList);

export default route;
