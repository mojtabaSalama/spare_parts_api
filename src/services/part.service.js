const { Op } = require('sequelize');
const { Part, Category, Supplier } = require('../models');
const ApiError = require('../utils/apiError');

const includeRelations = [
  { model: Category, as: 'category' },
  { model: Supplier, as: 'supplier' },
];

async function listParts({ search, categoryId, lowStockOnly } = {}) {
  const where = {};

  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { sku: { [Op.like]: `%${search}%` } },
    ];
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  const parts = await Part.findAll({
    where,
    include: includeRelations,
    order: [['name', 'ASC']],
  });

  if (lowStockOnly) {
    return parts.filter((p) => p.quantity <= p.minStockLevel);
  }

  return parts;
}

async function getPartById(id) {
  const part = await Part.findByPk(id, { include: includeRelations });
  if (!part) {
    throw ApiError.notFound('Part not found');
  }
  return part;
}

async function createPart(data) {
  const existing = await Part.findOne({ where: { sku: data.sku } });
  if (existing) {
    throw ApiError.conflict(`A part with SKU "${data.sku}" already exists`);
  }
  return Part.create(data);
}

async function updatePart(id, data) {
  const part = await getPartById(id);

  if (data.sku && data.sku !== part.sku) {
    const existing = await Part.findOne({ where: { sku: data.sku } });
    if (existing) {
      throw ApiError.conflict(`A part with SKU "${data.sku}" already exists`);
    }
  }

  await part.update(data);
  return part;
}

async function deletePart(id) {
  const part = await getPartById(id);
  await part.destroy();
  return true;
}

async function getLowStockParts() {
  const parts = await Part.findAll({ include: includeRelations });
  return parts.filter((p) => p.quantity <= p.minStockLevel);
}

module.exports = {
  listParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
  getLowStockParts,
};
