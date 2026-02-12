import { findOne, createUser, updateUserById, findAllUsers } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/resUtil.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { get, redisDelete, set } from '../utils/redis.js';
// import { sendMail } from '../utils/sendMail.js';
// import { getVerifyEmailTemplate, getOtpEmailTemplate } from '../utils/emailBody.js';

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
    });
    //3. generate jwt token
    let token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_KEY, {
      expiresIn: '24h',
    });
    user._doc.token = token;
    if (user) {
      //4.send vuser verification link
      // const verifyLink = `${process.env.BASE_URL}/api/auth/verifyEmail/${verifyToken}`;
      // const emailBody = getVerifyEmailTemplate(name, verifyLink);
      // sendMail(email, "Verify Your Email", emailBody);
      return successResponse(
        res,
        200,
        'User registered successfully.Please go to your email and verify your account',
        user
      );
    }
    return errorResponse(res, 400, 'User not registered');
  } catch (error) {
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
    return errorResponse(res, 500, 'Internal server error');
  }
};

export const getUserList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const users = await findAllUsers(limit, page);
    return successResponse(res, 200, 'Users list retrive successfully.', users);
  } catch (error) {
    return errorResponse(res, 500, 'Internal server error');
  }
};
