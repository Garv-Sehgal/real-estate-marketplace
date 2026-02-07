const express = require('express');
const healthController = require('../controllers/health.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
const requireRole = require('../middlewares/role.middleware');

router.get('/', authMiddleware, requireRole('admin'), healthController.getHealth);

module.exports = router;
