const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// Mount routes
router.post('/signup/request-otp', authController.requestSignupOTP);
router.post('/signup/verify-otp', authController.verifySignupOTP);

module.exports = router;
