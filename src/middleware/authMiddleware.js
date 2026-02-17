import { findOne } from '../services/auth.service.js';
import jwt from 'jsonwebtoken';
export const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  //1. checking token is provide or not
  if (!token) {
    return res.fail(401, 'Access denied. No authorization token provided ');
  }
  try {
    //2. decoded token
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await findOne({ _id: decoded.userId });

    //3. checking is existing user
    if (!user) {
      return res.fail(404, 'This user is not found');
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      return res.fail(401, 'Token expired.');
    }
    console.log('Internal server error', error);
    return res.fail(500, 'Invalid token.');
  }
};

export const authRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return res.fail(403, 'Access denied.');
      }
      next();
    } catch (error) {
      console.log('AuthRole Error:', error);
      return res.fail(500, 'Internal server error.');
    }
  };
};
