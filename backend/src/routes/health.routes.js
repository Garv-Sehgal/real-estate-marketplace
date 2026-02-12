const express = require('express');
const healthController = require('../controllers/health.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();
const requireLevel = require('../middlewares/role.middleware');

router.get('/', authMiddleware, requireLevel(4), healthController.getHealth);

module.exports = router;
