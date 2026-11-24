const stockService = require('../services/stock.service');
const { successResponse } = require('../utils/apiResponse');

async function stockIn(req, res, next) {
  try {
    const result = await stockService.stockIn(req.body, req.user.id);
    return successResponse(res, result, 'Stock added', 201);
  } catch (err) {
    next(err);
  }
}

async function stockOut(req, res, next) {
  try {
    const result = await stockService.stockOut(req.body, req.user.id);
    return successResponse(res, result, 'Stock removed', 201);
  } catch (err) {
    next(err);
  }
}

async function adjust(req, res, next) {
  try {
    const { partId, newQuantity, reason } = req.body;
    const result = await stockService.adjustStock({ partId, newQuantity, reason }, req.user.id);
    return successResponse(res, result, 'Stock adjusted', 201);
  } catch (err) {
    next(err);
  }
}

async function movements(req, res, next) {
  try {
    const data = await stockService.getMovementsForPart(req.params.partId);
    return successResponse(res, data, 'Stock movements fetched');
  } catch (err) {
    next(err);
  }
}

module.exports = { stockIn, stockOut, adjust, movements };
