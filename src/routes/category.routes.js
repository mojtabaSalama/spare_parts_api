const express = require('express');
const categoryController = require('../controllers/category.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', categoryController.list);
router.post('/', authorizeRoles('admin'), categoryController.create);
router.put('/:id', authorizeRoles('admin'), categoryController.update);
router.delete('/:id', authorizeRoles('admin'), categoryController.remove);

module.exports = router;
