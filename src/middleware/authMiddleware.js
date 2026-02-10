const { findOne } = require('../services/auth.service');
const { errorResponse } = require('../utils/resUtil');
const jwt = require('jsonwebtoken');
exports.auth = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    errorResponse(res, 401, 'Access denied. No authorization token provided ');
  }
  try {
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await findOne({ _id: decoded.userId });
    if (!user) {
      return errorResponse(res, 404, 'This user is not found');
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired.');
    }
    console.log('Internal server error', error);
    return errorResponse(res, 500, 'Invalid token.');
  }
};

exports.authRole = (roles = []) => {
  return async (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return errorResponse(res, 403, 'Access denied.');
      }
      next();
    } catch (error) {
      logger.error(`Unauthorized Error:${error.message}`);
      return errorResponse(res, 500, 'Internal server error.');
    }
  };
};
