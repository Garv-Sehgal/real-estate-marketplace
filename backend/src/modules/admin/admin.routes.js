const express = require('express');

const router = express.Router();

const adminController = require('./admin.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const requireLevel = require('../../middlewares/role.middleware');
const propertyAdminController = require('./property.admin.controller');

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
/* ---------------- PROPERTY MODERATION ---------------- */

// Pending list for admin dashboard
router.get(
    '/properties/pending',
    authMiddleware,
    requireLevel(4),
    propertyAdminController.getPending
);

// Admin view full property details
router.get(
    '/properties/:id',
    authMiddleware,
    requireLevel(4),
    propertyAdminController.getPropertyDetailsAdmin
);

// Approve property
router.patch(
    '/properties/:id/approve',
    authMiddleware,
    requireLevel(4),
    propertyAdminController.approve
);

// Reject property
router.patch(
    '/properties/:id/reject',
    authMiddleware,
    requireLevel(4),
    propertyAdminController.reject
);

// Request changes
router.patch(
    '/properties/:id/request-changes',
    authMiddleware,
    requireLevel(4),
    propertyAdminController.requestEdit
);

module.exports = router;
