const joi = require("joi");
const { ROLE } = require("../utils/constant");

exports.registerSchemaValidation = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  role: joi
    .string()
    .valid(...Object.values(ROLE))
    .default(ROLE.USER),
});

exports.loginSchemaValidation = joi.object({
  email: joi.string().required(),
  password: joi.string().min(6).required(),
});

exports.sendOtpSchemaValidation = joi.object({
  email: joi.string().required(),
});

exports.verifyOtpSchemaValidation = joi.object({
  email: joi.string().required(),
  otp: joi.string().required(),
});

exports.forgotPasswordSchemaValidation = joi.object({
  token: joi.string().required(),
  newPassword: joi.string().min(6).required(),
});
