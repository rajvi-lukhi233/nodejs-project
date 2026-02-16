import { findOne, updateUserById, findUserById } from '../services/auth.service.js';

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await findOne({ _id: userId });
    if (!user) {
      return res.fail(404, 'This user is not found');
    }
    return res.success(200, 'User profile retrive successfully', user);
  } catch (error) {
    console.log('GetUserProfile API Error:', error);
    return res.fail(500, 'Internal server error');
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;
    if (email) {
      const existUser = await findOne({ email });
      if (existUser) {
        return res.fail(400, 'This email is already registered please use other email.');
      }
    }
    const updatedUser = await updateUserById(userId, { name, email });
    if (updateUserById) {
      return res.success(200, 'User profile updated successfully.', updatedUser);
    }
    return res.fail(400, 'User profile not updated');
  } catch (error) {
    console.log('UpdateUserProfile API Error:', error);
    return res.fail(500, 'Internal server error');
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await findUserById(userId, { id: 1 });
    if (!user) {
      return res.fail(404, 'This user is not found');
    }
    await updateUserById(userId, { deletedAt: Date.now() });
    return res.success(200, 'User deleted successfully.');
  } catch (error) {
    console.log('DeleteUserProfile API Error:', error);
    return res.fail(500, 'Internal server error');
  }
};
