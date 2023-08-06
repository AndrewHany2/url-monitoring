const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8)
    .pattern(/[a-z]/, 'At least one lowercase letter')
    .pattern(/[A-Z]/, 'At least one uppercase letter')
    .pattern(/\d/, 'At least one number')
    .pattern(/[@$!%*?&#]/, 'At least one special character (symbol)').required()
});

const emailVerficationSchema = Joi.object({
  token: Joi.string().required(),
  id: Joi.string().required()
});
module.exports = { registerSchema, emailVerficationSchema };
