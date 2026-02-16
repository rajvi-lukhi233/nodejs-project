import { findAllMessage } from '../services/message.service.js';

export const getMessageList = async (req, res) => {
  try {
    const { userId } = req.user;
    const list = await findAllMessage(userId);
    return res.success(200, 'List retrive successfully.', list);
  } catch (error) {
    console.log('GetMessageList API Error:', error);
    return res.fail(500, 'Internal server error');
  }
};
