import joi from 'joi';

export const updateUserSchemaValidation = joi.object({
  userId: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  name: joi.string().optional(),
  email: joi.string().email().optional(),
});

export const deleteUserSchemaValidation = joi.object({
  userId: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
