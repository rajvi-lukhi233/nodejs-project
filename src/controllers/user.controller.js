const {
  findOne,
  updateUserById,
  deleteUser,
  findUserById,
} = require("../services/auth.service");
const { logger } = require("../utils/logger");
const { errorResponse, successResponse } = require("../utils/resUtil");

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await findOne({ _id: userId });
    if (!user) {
      return errorResponse(res, 404, "This user is not found");
    }
    return successResponse(res, 200, "User profile retrive successfully", user);
  } catch (error) {
    logger.error(`getUserProfile API Error:${error.message}`);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    logger.info("User updated.");
    const { userId } = req.params;
    const { name, email } = req.body;
    if (email) {
      const existUser = await findOne({ email });
      if (existUser) {
        return errorResponse(
          res,
          400,
          "This email is already registered please use other email.",
        );
      }
    }
    const updatedUser = await updateUserById(userId, { name, email });
    if (updateUserById) {
      return successResponse(
        res,
        200,
        "User profile updated successfully.",
        updatedUser,
      );
    }
    return errorResponse(res, 400, "User profile not updated");
  } catch (error) {
    logger.error(`updateUserProfile API Error:${error.message}`);
    return errorResponse(res, 500, "Internal server error");
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    logger.info("User deleted.");
    const { userId } = req.params;
    const user = await findUserById(userId, { id: 1 });
    if (!user) {
      return errorResponse(res, 404, "This user is not found");
    }
    await updateUserById(userId, { deletedAt: Date.now() });
    return successResponse(res, 200, "User deleted successfully.");
  } catch (error) {
    logger.error(`deleteUserProfile API Error:${error.message}`);
    return errorResponse(res, 500, "Internal server error");
  }
};
