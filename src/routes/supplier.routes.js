const express = require('express');
const supplierController = require('../controllers/supplier.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', supplierController.list);
router.post('/', authorizeRoles('admin'), supplierController.create);
router.put('/:id', authorizeRoles('admin'), supplierController.update);
router.delete('/:id', authorizeRoles('admin'), supplierController.remove);

module.exports = router;
