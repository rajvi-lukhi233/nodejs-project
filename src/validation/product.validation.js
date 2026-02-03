const joi = require("joi");
const { ROLE } = require("../utils/constant");

exports.productSchemaValidation = joi.object({
  name: joi.string().required(),
  image: joi.string().optional(),
  price: joi.number().required(),
  description: joi.string().optional(),
  stock: joi.number().optional(),
  category: joi.string().required(),
});
