const mongoose = require("mongoose");
const { DB_NAME, ROLE } = require("../utils/constant");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.USER,
    },
    otpCode: {
      type: String,
      default: null,
    },
    otpExpiredAt: {
      type: Date,
      default: null,
    },
    resetPassToken: {
      type: String,
      default: null,
    },
    resetPassTokenExpiredAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, versionKey: false },
);

exports.userModel = mongoose.model(DB_NAME.USER, userSchema);
