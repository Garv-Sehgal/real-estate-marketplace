const express = require('express');
const healthController = require('../controllers/health.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/', authMiddleware, healthController.getHealth);

module.exports = router;
