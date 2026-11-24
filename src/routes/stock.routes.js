const express = require('express');
const stockController = require('../controllers/stock.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const partValidator = require('../validators/part.validator');

const router = express.Router();

router.use(verifyToken); // both admin and staff can move stock

router.post('/in', validate(partValidator.stockChange), stockController.stockIn);
router.post('/out', validate(partValidator.stockChange), stockController.stockOut);
router.post('/adjust', stockController.adjust);
router.get('/movements/:partId', stockController.movements);

module.exports = router;
