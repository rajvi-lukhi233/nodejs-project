import express from 'express';
import { validation } from '../middleware/validationMiddleware.js';
import {
  updateUserProfile,
  deleteUserProfile,
  getUserProfile,
} from '../controllers/user.controller.js';
import {
  updateUserSchemaValidation,
  deleteUserSchemaValidation,
} from '../validation/user.valiadtion.js';
import { auth } from '../middleware/authMiddleware.js';
const route = express.Router();

route
  .get('/', auth, getUserProfile)
  .put('/updateUser/:userId', auth, validation(updateUserSchemaValidation), updateUserProfile)
  .delete('/deleteUser/:userId', auth, validation(deleteUserSchemaValidation), deleteUserProfile);
export default route;
