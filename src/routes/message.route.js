const express = require('express');
const { auth } = require('../middleware/authMiddleware');
const { getMessageList } = require('../controllers/message.controller');
const route = express.Router();

route.get('/messageList', auth, getMessageList);

module.exports = route;
