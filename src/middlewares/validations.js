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

const checkValidationSchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().required(),
  protocol: Joi.string().valid('HTTP', 'HTTPS', 'TCP').required(),
  path: Joi.string().allow(''),
  port: Joi.string().allow(''),
  webhook: Joi.number().allow(null),
  timeout: Joi.number().allow(null),
  interval: Joi.number().allow(null),
  threshold: Joi.number().allow(null),
  authentication: {
    username: Joi.string().allow(''),
    password: Joi.string().allow('')
  },
  httpHeaders: [
    {
      key: Joi.string().required(),
      value: Joi.string().required()
    }
  ],
  assert: {
    statusCode: Joi.number().allow(null)
  },
  tags: Joi.array().items(Joi.string()),
  ignoreSSL: Joi.boolean().allow(null)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

module.exports = { registerSchema, emailVerficationSchema, checkValidationSchema, loginSchema };
