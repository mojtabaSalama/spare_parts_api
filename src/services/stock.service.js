const { sequelize, Part, StockMovement, User } = require('../models');
const ApiError = require('../utils/apiError');

/**
 * Increases a part's quantity and logs the movement, atomically.
 */
async function stockIn({ partId, quantity, reason }, userId) {
  return sequelize.transaction(async (t) => {
    const part = await Part.findByPk(partId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!part) {
      throw ApiError.notFound('Part not found');
    }

    part.quantity += quantity;
    await part.save({ transaction: t });

    const movement = await StockMovement.create(
      { partId, userId, type: 'IN', quantity, reason },
      { transaction: t }
    );

    return { part, movement };
  });
}

/**
 * Decreases a part's quantity and logs the movement, atomically.
 * Refuses to let stock go negative.
 */
async function stockOut({ partId, quantity, reason }, userId) {
  return sequelize.transaction(async (t) => {
    const part = await Part.findByPk(partId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!part) {
      throw ApiError.notFound('Part not found');
    }

    if (part.quantity < quantity) {
      throw ApiError.badRequest(
        `Insufficient stock: only ${part.quantity} unit(s) of "${part.name}" available`
      );
    }

    part.quantity -= quantity;
    await part.save({ transaction: t });

    const movement = await StockMovement.create(
      { partId, userId, type: 'OUT', quantity, reason },
      { transaction: t }
    );

    return { part, movement };
  });
}

/**
 * Sets a part's quantity to an explicit value (e.g. after a physical count),
 * logging the delta as an ADJUSTMENT movement.
 */
async function adjustStock({ partId, newQuantity, reason }, userId) {
  return sequelize.transaction(async (t) => {
    const part = await Part.findByPk(partId, { transaction: t, lock: t.LOCK.UPDATE });
    if (!part) {
      throw ApiError.notFound('Part not found');
    }

    const delta = newQuantity - part.quantity;
    part.quantity = newQuantity;
    await part.save({ transaction: t });

    const movement = await StockMovement.create(
      {
        partId,
        userId,
        type: 'ADJUSTMENT',
        quantity: Math.abs(delta),
        reason: reason || `Adjusted from ${part.quantity - delta} to ${newQuantity}`,
      },
      { transaction: t }
    );

    return { part, movement };
  });
}

async function getMovementsForPart(partId) {
  return StockMovement.findAll({
    where: { partId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'DESC']],
  });
}

module.exports = { stockIn, stockOut, adjustStock, getMovementsForPart };
