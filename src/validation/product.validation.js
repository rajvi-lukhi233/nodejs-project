const joi = require('joi');

exports.productSchemaValidation = joi.object({
  name: joi.string().required(),
  image: joi.string().optional(),
  price: joi.number().required(),
  description: joi.string().optional(),
  stock: joi.number().optional(),
  category: joi.string().required(),
});

exports.updateProductSchemaValidation = joi.object({
  productId: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  name: joi.string().optional(),
  image: joi.string().optional(),
  price: joi.number().optional(),
  description: joi.string().optional(),
  stock: joi.number().optional(),
  category: joi.string().optional(),
});

exports.deleteProductSchemaValidation = joi.object({
  productId: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
