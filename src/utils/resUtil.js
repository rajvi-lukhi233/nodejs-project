exports.successResponse = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
};

exports.errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};
