import Joi from "joi";

const createProductsValidation = Joi.object({
  UserId: Joi.number().positive().required(),
  productId: Joi.number().positive().required(),
  quantity: Joi.number().positive().required(),
});

const getProductsValidation = Joi.number().min(1).positive().required();

const updateProductsValidation = Joi.object({
  id: Joi.number().min(1).positive().required(),
  name: Joi.string().max(200).required(),
  price: Joi.number().positive().required(),
  description: Joi.string().max(1000).optional(),
  imageUrl: Joi.string().optional(),
});

const deleteProductValidation = Joi.object({});

export {
  createProductsValidation,
  getProductsValidation,
  updateProductsValidation,
  deleteProductValidation,
};
