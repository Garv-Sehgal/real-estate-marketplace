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

module.exports = router;
