const partService = require('../services/part.service');
const { successResponse } = require('../utils/apiResponse');

async function list(req, res, next) {
  try {
    const { search, categoryId, lowStockOnly } = req.query;
    const parts = await partService.listParts({
      search,
      categoryId: categoryId ? Number(categoryId) : undefined,
      lowStockOnly: lowStockOnly === 'true',
    });
    return successResponse(res, parts, 'Parts fetched');
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const part = await partService.getPartById(req.params.id);
    return successResponse(res, part, 'Part fetched');
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const part = await partService.createPart(req.body);
    return successResponse(res, part, 'Part created', 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const part = await partService.updatePart(req.params.id, req.body);
    return successResponse(res, part, 'Part updated');
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await partService.deletePart(req.params.id);
    return successResponse(res, null, 'Part deleted');
  } catch (err) {
    next(err);
  }
}

async function lowStock(req, res, next) {
  try {
    const parts = await partService.getLowStockParts();
    return successResponse(res, parts, 'Low stock parts fetched');
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, remove, lowStock };
