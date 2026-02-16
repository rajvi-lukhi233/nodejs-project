import { findOne, createUser, updateUserById, findAllUsers } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/resUtil.js';
import bcrypt from 'bcrypt';

import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { get, redisDelete, set } from '../utils/redis.js';
import { PROVIDER } from '../utils/constant.js';
import { getChannel } from '../../config/rabbitmqConfig.js';

export const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    //1. checking is existinvg user
    const existUser = await findOne({ email }, { id: 1 });
    if (existUser) {
      return errorResponse(
        res,
        400,
        'User already registered with this email.Please use other email.'
      );
    }
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const bcryptedPass = await bcrypt.hash(password, 10);

    //2. create user
    const user = await createUser({
      name,
      email,
      password: bcryptedPass,
      role,
      emailVerifyToken: verifyToken,
      provider: PROVIDER.LOCAL,
    });
    //3. generate jwt token
    let token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_KEY, {
      expiresIn: '24h',
    });
    user._doc.token = token;

    const channel = getChannel();
    const message = {
      name,
      email,
      verifyToken,
    };
    channel.sendToQueue('send_verification_email', Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    if (user) {
      return successResponse(
        res,
        200,
        'User registered successfully.Please go to your email and verify your account',
        user
      );
    }
    return errorResponse(res, 400, 'User not registered');
  } catch (error) {
    console.log('Register API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await findOne({ emailVerifyToken: token }, { id: 1 });
    if (!user) {
      return errorResponse(res, 400, 'Invalid emailverification token.');
    }
    await updateUserById(user._id, {
      isVerified: true,
      emailVerifyToken: null,
    });
    return successResponse(res, 200, 'Email verified successfully.');
  } catch (error) {
    console.log('verifyEmail API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await findOne({ email });

    if (!user) {
      return errorResponse(res, 404, 'User is not registered with this email.');
    }

    if (user.provider !== PROVIDER.LOCAL) {
      return errorResponse(res, 400, 'Please login with google.');
    }

    if (!user.isVerified) {
      return errorResponse(res, 400, 'Please verify your email.');
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return errorResponse(res, 400, 'Incorrect password.');
    }
    let token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_KEY, {
      expiresIn: '24h',
    });
    user._doc.token = token;
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
    return successResponse(res, 200, 'User login successfully.', userResponse);
  } catch (error) {
    console.log('Login API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000);
    if (!user) {
      return errorResponse(res, 404, 'This user is not found');
    }
    // await updateUserById(user.id, {
    //   otpCode: otp,
    //   otpExpiredAt: new Date(Date.now() + 10 * 60 * 1000),
    // });
    await set(`otp:${user.id}`, otp, 60);
    // const emailBody = getOtpEmailTemplate(user.name, otp);
    // sendMail(email, "Forgot password OPT", emailBody);
    return successResponse(res, 200, 'OTP has been sent to your email address successfully.', {
      otp,
    });
  } catch (error) {
    console.log('SendOTP API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const resetPassToken = crypto.randomBytes(32).toString('hex');
    const user = await findOne({ email });
    if (!user) {
      return errorResponse(res, 404, 'This user is not found');
    }
    const storedOtp = await get(`otp:${user.id}`);
    if (!storedOtp) {
      return errorResponse(res, 400, 'OTP has expired or not found. Please request a new one');
    }
    if (storedOtp !== otp) {
      return errorResponse(res, 400, 'Invalid OTP.');
    }
    await redisDelete(`otp:${user.id}`);
    await updateUserById(user.id, {
      resetPassToken,
      resetPassTokenExpiredAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    return successResponse(res, 200, 'OTP verified successfully.', {
      token: resetPassToken,
    });
  } catch (error) {
    console.log('verifyOTP API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;
    const user = await findOne({ resetPassToken: token });
    if (!user) {
      return errorResponse(res, 400, 'Invalid Reset passwordn');
    }
    if (user.resetPassTokenExpiredAt < new Date()) {
      return errorResponse(res, 400, 'Reset password token has expired.');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserById(user.id, {
      resetPassToken: null,
      resetPassTokenExpiredAt: null,
      password: hashedPassword,
    });

    return successResponse(res, 200, 'Password reset successfully.');
  } catch (error) {
    console.log('ForgotPassword API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const getUserList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const users = await findAllUsers(limit, page);
    return successResponse(res, 200, 'Users list retrive successfully.', users);
  } catch (error) {
    console.log('getUserList API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const twoFactorSetup = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findOne({ email });
    if (!user) {
      return errorResponse(res, 404, 'User not found.');
    }
    const secret = speakeasy.generateSecret({
      length: 20,
      name: 'TOTP-APP',
    });

    await updateUserById(user.id, { twoFactorSecret: secret.base32 });

    const qr = await QRCode.toDataURL(secret.otpauth_url);

    return successResponse(res, 200, 'TwoFactor successfully setup.', {
      secret: secret.base32,
      qrCode: qr,
    });
  } catch (error) {
    console.log('TwoFactorSetup API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const twoFactorVerify = async (req, res) => {
  try {
    const { token, email } = req.body;

    const user = await findOne({ email });
    if (!user) {
      return errorResponse(res, 404, 'User not found.');
    }
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) return errorResponse(res, 400, 'Invalid code');

    await updateUserById(user.id, { twoFactorEnabled: true });

    return successResponse(res, 200, '2FA Enabled Successfully');
  } catch (error) {
    console.log('TwoFactorVerify API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const twoFactorLogin = async (req, res) => {
  try {
    const { email, token } = req.body;

    const user = await findOne({ email });
    if (!user) return errorResponse(res, 404, 'User not found');

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) return errorResponse(res, 400, 'Invalid 2FA Code');

    const jwtToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_KEY);

    return successResponse(res, 200, 'User login successfully.', { token: jwtToken });
  } catch (error) {
    console.log('TwoFactorLogin API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const loginWithGoogleLink = async (req, res) => {
  try {
    return res.send('<a href="auth/google">Login with Google</a>');
  } catch (error) {
    console.log('loginWithGoogleLink API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const loginWithGoogle = async (req, res) => {
  try {
    const user = req.user;
    let token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_KEY, {
      expiresIn: '24h',
    });
    //redirect to success frontend page
    return successResponse(res, 200, 'Login with google successfully.', { token });
  } catch (error) {
    console.log('LoginWithGoogle API Error:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};
