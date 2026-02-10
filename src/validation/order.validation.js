import joi from 'joi';

export const createOrderSchemaValidation = joi.object({
  products: joi
    .array()
    .items(
      joi.object({
        productId: joi
          .string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .required(),
        quantity: joi.number().min(1).required(),
      })
    )
    .required(),
  shippingAddress: joi.object({
    city: joi.string().optional(),
    state: joi.string().optional(),
    country: joi.string().optional(),
    zipCode: joi.string().optional(),
    address: joi.string().optional(),
  }),
});

export const updateOrderSchemaValidation = joi.object({
  orderId: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  products: joi
    .array()
    .items(
      joi.object({
        productId: joi
          .string()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .optional(),
        quantity: joi.number().min(1).optional(),
      })
    )
    .optional(),
  shippingAddress: joi.object({
    city: joi.string().optional(),
    state: joi.string().optional(),
    country: joi.string().optional(),
    zipCode: joi.string().optional(),
    address: joi.string().optional(),
  }),
});

export const deleteOrderSchemaValidation = joi.object({
  orderId: joi
    .string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
