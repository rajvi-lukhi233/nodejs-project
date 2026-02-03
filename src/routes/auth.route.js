const express = require("express");
const {
  register,
  login,
  forgotPassword,
  sendOtp,
  verifyOtp,
} = require("../controllers/auth.controller");
const { validation } = require("../middleware/validationMiddleware");
const {
  registerSchemaValidation,
  loginSchemaValidation,
  sendOtpSchemaValidation,
  verifyOtpSchemaValidation,
  forgotPasswordSchemaValidation,
} = require("../validation/auth.validation");
const route = express.Router();

route
  .post("/register", validation(registerSchemaValidation), register)
  .post("/login", validation(loginSchemaValidation), login)
  .post("/sendOtp", validation(sendOtpSchemaValidation), sendOtp)
  .post("/verifyOtp", validation(verifyOtpSchemaValidation), verifyOtp)
  .post(
    "/forgotPassword",
    validation(forgotPasswordSchemaValidation),
    forgotPassword,
  );

module.exports = route;
