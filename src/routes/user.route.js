const express = require("express");
const { validation } = require("../middleware/validationMiddleware");
const {
  updateUserProfile,
  deleteUserProfile,
  getUserProfile,
} = require("../controllers/user.controller");
const {
  updateUserSchemaValidation,
  deleteUserSchemaValidation,
} = require("../validation/user.valiadtion");
const { auth } = require("../middleware/authMiddleware");
const route = express.Router();

route
  .get("/", auth, getUserProfile)
  .put(
    "/updateUserById/:userId",
    validation(updateUserSchemaValidation),
    updateUserProfile,
  )
  .delete(
    "/deleteUser/:userId",
    validation(deleteUserSchemaValidation),
    deleteUserProfile,
  );

module.exports = route;
