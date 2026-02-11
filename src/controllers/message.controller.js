import { findAllMessage } from '../services/message.service.js';
import { errorResponse, successResponse } from '../utils/resUtil.js';

export const getMessageList = async (req, res) => {
  try {
    const { userId } = req.user;
    const list = await findAllMessage(userId);
    return successResponse(res, 200, 'List retrive successfully.', list);
  } catch (error) {
    return errorResponse(res, 500, 'Internal server error');
  }
};
