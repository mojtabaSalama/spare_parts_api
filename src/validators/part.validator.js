const Joi = require('joi');

const createPart = Joi.object({
  sku: Joi.string().min(1).max(50).required(),
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().max(1000).allow('', null),
  quantity: Joi.number().integer().min(0).default(0),
  minStockLevel: Joi.number().integer().min(0).default(5),
  price: Joi.number().min(0).required(),
  categoryId: Joi.number().integer().allow(null),
  supplierId: Joi.number().integer().allow(null),
});

const updatePart = Joi.object({
  sku: Joi.string().min(1).max(50),
  name: Joi.string().min(1).max(255),
  description: Joi.string().max(1000).allow('', null),
  minStockLevel: Joi.number().integer().min(0),
  price: Joi.number().min(0),
  categoryId: Joi.number().integer().allow(null),
  supplierId: Joi.number().integer().allow(null),
}).min(1); // require at least one field on update

const stockChange = Joi.object({
  partId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
  reason: Joi.string().max(500).allow('', null),
});

module.exports = { createPart, updatePart, stockChange };
