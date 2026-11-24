const express = require('express');

const authRoutes = require('./auth.routes');
const partRoutes = require('./part.routes');
const categoryRoutes = require('./category.routes');
const supplierRoutes = require('./supplier.routes');
const stockRoutes = require('./stock.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/parts', partRoutes);
router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/stock', stockRoutes);

module.exports = router;
