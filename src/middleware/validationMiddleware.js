const { errorResponse } = require("../utils/resUtil");

exports.validation = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate({
        ...req.body,
        ...req.params,
        ...req.query,
      });
      if (error) {
        return errorResponse(res, 400, error.details[0].message);
      }
      next();
    } catch (error) {
      logger.error(`Validation Error:${error.message}`);
      return errorResponse(res, 500, "Internal server error during validation");
    }
  };
};
