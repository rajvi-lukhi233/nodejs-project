import joi from 'joi';
import { ROLE } from '../utils/constant.js';

export const registerSchemaValidation = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  role: joi
    .string()
    .valid(...Object.values(ROLE))
    .default(ROLE.USER),
});

export const loginSchemaValidation = joi.object({
  email: joi.string().required(),
  password: joi.string().min(6).required(),
});

export const sendOtpSchemaValidation = joi.object({
  email: joi.string().required(),
});

export const verifyOtpSchemaValidation = joi.object({
  email: joi.string().required(),
  otp: joi.string().required(),
});

export const forgotPasswordSchemaValidation = joi.object({
  token: joi.string().required(),
  newPassword: joi.string().min(6).required(),
});
