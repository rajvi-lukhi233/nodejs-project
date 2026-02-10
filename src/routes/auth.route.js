const express = require('express');
const {
  register,
  login,
  forgotPassword,
  sendOtp,
  verifyOtp,
  verifyEmail,
  getUserList,
} = require('../controllers/auth.controller');
const { validation } = require('../middleware/validationMiddleware');
const {
  registerSchemaValidation,
  loginSchemaValidation,
  sendOtpSchemaValidation,
  verifyOtpSchemaValidation,
  forgotPasswordSchemaValidation,
} = require('../validation/auth.validation');
const { authRole, auth } = require('../middleware/authMiddleware');
const { ROLE } = require('../utils/constant');
const route = express.Router();

route
  .post('/register', validation(registerSchemaValidation), register)
  .post('/login', validation(loginSchemaValidation), login)
  .post('/sendOtp', validation(sendOtpSchemaValidation), sendOtp)
  .post('/verifyOtp', validation(verifyOtpSchemaValidation), verifyOtp)
  .post('/forgotPassword', validation(forgotPasswordSchemaValidation), forgotPassword)
  .get('/verifyEmail/:token', verifyEmail)
  .get('/userList', getUserList);

module.exports = route;
