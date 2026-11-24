const { Category } = require('../models');
const { successResponse } = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

async function list(req, res, next) {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return successResponse(res, categories, 'Categories fetched');
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, description } = req.body;
    if (!name) throw ApiError.badRequest('name is required');

    const category = await Category.create({ name, description });
    return successResponse(res, category, 'Category created', 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) throw ApiError.notFound('Category not found');

    await category.update(req.body);
    return successResponse(res, category, 'Category updated');
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) throw ApiError.notFound('Category not found');

    await category.destroy();
    return successResponse(res, null, 'Category deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
