import express from 'express';
import {
  register,
  login,
  forgotPassword,
  sendOtp,
  verifyOtp,
  verifyEmail,
  getUserList,
  twoFactorSetup,
  twoFactorVerify,
  twoFactorLogin,
  loginWithGoogle,
  loginWithGoogleLink,
} from '../controllers/auth.controller.js';
import { validation } from '../middleware/validationMiddleware.js';
import {
  registerSchemaValidation,
  loginSchemaValidation,
  sendOtpSchemaValidation,
  verifyOtpSchemaValidation,
  forgotPasswordSchemaValidation,
} from '../validation/auth.validation.js';
import { auth } from '../middleware/authMiddleware.js';
import passport from 'passport';
const route = express.Router();

route
  .post('/register', validation(registerSchemaValidation), register)
  .post('/login', validation(loginSchemaValidation), login)
  .post('/sendOtp', validation(sendOtpSchemaValidation), sendOtp)
  .post('/verifyOtp', validation(verifyOtpSchemaValidation), verifyOtp)
  .post('/forgotPassword', validation(forgotPasswordSchemaValidation), forgotPassword)
  .get('/verifyEmail/:token', verifyEmail)
  .get('/userList', getUserList)
  .get('/2faSetup', auth, twoFactorSetup)
  .post('/2faVerify', auth, twoFactorVerify)
  .post('/2faLogin', twoFactorLogin)
  .get('/', loginWithGoogleLink)
  .get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
  .get('/google/callback', passport.authenticate('google', { session: false }), loginWithGoogle);
export default route;
