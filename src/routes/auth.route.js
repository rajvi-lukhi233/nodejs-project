import express from 'express';
import {
  register,
  login,
  forgotPassword,
  sendOtp,
  verifyOtp,
  verifyEmail,
  getUserList,
} from '../controllers/auth.controller.js';
import { validation } from '../middleware/validationMiddleware.js';
import {
  registerSchemaValidation,
  loginSchemaValidation,
  sendOtpSchemaValidation,
  verifyOtpSchemaValidation,
  forgotPasswordSchemaValidation,
} from '../validation/auth.validation.js';
const route = express.Router();

route
  .post('/register', validation(registerSchemaValidation), register)
  .post('/login', validation(loginSchemaValidation), login)
  .post('/sendOtp', validation(sendOtpSchemaValidation), sendOtp)
  .post('/verifyOtp', validation(verifyOtpSchemaValidation), verifyOtp)
  .post('/forgotPassword', validation(forgotPasswordSchemaValidation), forgotPassword)
  .get('/verifyEmail/:token', verifyEmail)
  .get('/userList', getUserList);

export default route;
