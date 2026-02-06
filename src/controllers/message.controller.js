const { findAllMessage } = require("../services/message.service");
const { logger } = require("../utils/logger");
const { errorResponse, successResponse } = require("../utils/resUtil");

exports.getMessageList = async (req, res) => {
  try {
    const { userId } = req.user;
    const list = await findAllMessage(userId);
    return successResponse(res, 200, "List retrive successfully.", list);
  } catch (error) {
    logger.error(`getMessageList Error:${error.message}`);
    return errorResponse(res, 500, "Internal server error");
  }
};
