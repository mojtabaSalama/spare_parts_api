const { Supplier } = require('../models');
const { successResponse } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

async function list(req, res, next) {
  try {
    const suppliers = await Supplier.findAll({ order: [['name', 'ASC']] });
    return successResponse(res, suppliers, 'Suppliers fetched');
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, contactName, phone, email, address } = req.body;
    if (!name) throw ApiError.badRequest('name is required');

    const supplier = await Supplier.create({ name, contactName, phone, email, address });
    return successResponse(res, supplier, 'Supplier created', 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) throw ApiError.notFound('Supplier not found');

    await supplier.update(req.body);
    return successResponse(res, supplier, 'Supplier updated');
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) throw ApiError.notFound('Supplier not found');

    await supplier.destroy();
    return successResponse(res, null, 'Supplier deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
