const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const { requestMeeting, getIncoming, getSent, updateStatus } = require('./meeting.controller');

// All routes require authentication
router.use(authMiddleware);

// POST /api/v1/meetings - Create a new meeting request
router.post('/', requestMeeting);

// GET /api/v1/meetings/incoming - Property owner sees requests for their listings
router.get('/incoming', getIncoming);

// GET /api/v1/meetings/sent - User sees their own sent requests
router.get('/sent', getSent);

// PATCH /api/v1/meetings/:id/status - Owner confirms or rejects
router.patch('/:id/status', updateStatus);

module.exports = router;
