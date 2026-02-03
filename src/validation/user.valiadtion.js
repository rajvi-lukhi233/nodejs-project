const joi = require("joi");

exports.updateUserSchemaValidation = joi.object({
  userId: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  name: joi.string().optional(),
  email: joi.string().email().optional(),
});

exports.deleteUserSchemaValidation = joi.object({
  userId: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
