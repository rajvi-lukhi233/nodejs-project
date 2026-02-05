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
    "/updateUser/:userId",
    auth,
    validation(updateUserSchemaValidation),
    updateUserProfile,
  )
  .delete(
    "/deleteUser/:userId",
    auth,
    validation(deleteUserSchemaValidation),
    deleteUserProfile,
  );

module.exports = route;
