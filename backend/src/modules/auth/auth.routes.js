const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const sessionController = require('./auth.session.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Mount routes
router.post('/signup/request-otp', authController.requestSignupOTP);
router.post('/signup/verify-otp', authController.verifySignupOTP);
router.post('/login', authController.login);
router.post('/refresh', sessionController.refreshSession);
router.post('/logout', authMiddleware, authController.logout);
router.post('/change-password', authMiddleware, authController.changePassword);

// profile
router.get('/me', authMiddleware, authController.getMe);
router.patch('/me', authMiddleware, authController.updateMe);

// forgot password
router.post('/password/request-reset-otp', authController.requestPasswordResetOTP);
router.post('/password/verify-reset-otp', authController.verifyPasswordResetOTP);
router.post('/password/set-new-password', authController.setNewPassword);

module.exports = router;