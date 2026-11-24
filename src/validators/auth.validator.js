const Joi = require('joi');

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const createStaff = Joi.object({
  name: Joi.string().min(1).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const refresh = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { login, createStaff, refresh };