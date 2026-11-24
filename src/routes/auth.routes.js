const express = require('express');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const authValidator = require('../validators/auth.validator');
const { verifyToken, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/login', validate(authValidator.login), authController.login);
router.post('/refresh', validate(authValidator.refresh), authController.refresh);
router.get('/me', verifyToken, authController.me);
router.post('/staff', verifyToken, requireAdmin, validate(authValidator.createStaff), authController.createStaff);

module.exports = router;