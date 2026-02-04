const {
  findOne,
  createUser,
  updateUserById,
} = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/resUtil");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { logger } = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    const existUser = await findOne({ email }, { id: 1 });
    if (existUser) {
      return errorResponse(
        res,
        400,
        "User already registered with this email.Please use other email.",
      );
    }
    const bcryptedPass = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email,
      password: bcryptedPass,
      role,
    });
    let token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: "24h",
      },
    );
    user._doc.token = token;
    if (user) {
      return successResponse(res, 200, "User registered successfully.", user);
    }
    return errorResponse(res, 400, "User not registered");
  } catch (error) {
    logger.error(`Register API Error:${error.message}`);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "User is not registered with this email.");
    }
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return errorResponse(res, 400, "Incorrect password.");
    }
    let token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_KEY,
      {
        expiresIn: "24h",
      },
    );
    user._doc.token = token;
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
    logger.info("User login.");
    return successResponse(res, 200, "User login successfully.", userResponse);
  } catch (error) {
    logger.error(`Login API Error:${error.message}`);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000);
    if (!user) {
      return errorResponse(res, 404, "This user is not found");
    }
    await updateUserById(user.id, {
      otpCode: otp,
      otpExpiredAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    return successResponse(
      res,
      200,
      "OTP has been sent to your email address successfully.",
      { otp },
    );
  } catch (error) {
    logger.error(`Send OTP API Error:${error.message}`);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const resetPassToken = crypto.randomBytes(32).toString("hex");
    const user = await findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "This user is not found");
    }
    if (user.otpCode !== otp) {
      return errorResponse(res, 400, "Invalid OTP.");
    }
    if (user.otpExpiredAt < new Date()) {
      return errorResponse(
        res,
        400,
        "OTP has expired. Please request a new one",
      );
    }
    await updateUserById(user.id, {
      otp: null,
      otpExpiredAt: null,
      resetPassToken,
      resetPassTokenExpiredAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    return successResponse(res, 200, "OTP verified successfully.", {
      token: resetPassToken,
    });
  } catch (error) {
    logger.error(`Verify OTP API Error:${error.message}`);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { newPassword, token } = req.body;
    const user = await findOne({ resetPassToken: token });
    if (!user) {
      return errorResponse(res, 400, "Invalid Reset passwordn");
    }
    if (user.resetPassTokenExpiredAt < new Date()) {
      return errorResponse(res, 400, "Reset password token has expired.");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserById(user.id, {
      resetPassToken: null,
      resetPassTokenExpiredAt: null,
      password: hashedPassword,
    });

    return successResponse(res, 200, "Password reset successfully.");
  } catch (error) {
    logger.error(`Forgot password API Error:${error.message}`);
    return errorResponse(res, 500, "Internal server error");
  }
};
