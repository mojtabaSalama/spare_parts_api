const express = require('express');
const partController = require('../controllers/part.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const partValidator = require('../validators/part.validator');

const router = express.Router();

router.use(verifyToken); // every part route requires authentication

router.get('/', partController.list);
router.get('/low-stock', partController.lowStock);
router.get('/:id', partController.getOne);

router.post('/', authorizeRoles('admin'), validate(partValidator.createPart), partController.create);
router.put('/:id', authorizeRoles('admin'), validate(partValidator.updatePart), partController.update);
router.delete('/:id', authorizeRoles('admin'), partController.remove);

module.exports = router;
