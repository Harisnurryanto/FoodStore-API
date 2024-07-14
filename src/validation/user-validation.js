import Joi from "joi";

const registerUserValidation = Joi.object({
  name: Joi.string().max(255).min(5).required(),
  email: Joi.string().max(255).min(5).email().required(),
  password: Joi.string().max(255).min(5).required(),
});

const loginUserValidation = Joi.object({
  email: Joi.string().max(255).email().required(),
  password: Joi.string().max(255).required(),
});

const getUserValidation = Joi.string().max(100).required();

export { registerUserValidation, loginUserValidation, getUserValidation };
