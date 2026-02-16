const express = require('express');

const router = express.Router();

const adminController = require('./admin.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requireLevel = require('../../middlewares/role.middleware');

// ONLY SUPER ADMIN CAN CREATE ADMINS
router.post(
    '/create',
    authMiddleware,
    requireLevel(5),
    adminController.createAdmin
);

// ONLY SUPER ADMIN CAN SUSPEND ADMINS / STAFF
router.patch(
    '/suspend',
    authMiddleware,
    requireLevel(5),
    adminController.suspendAdmin
);

module.exports = router;
