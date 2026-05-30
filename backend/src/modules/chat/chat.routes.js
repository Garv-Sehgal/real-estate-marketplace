const express = require('express');
const protect = require('../../middlewares/auth.middleware');
const chatController = require('./chat.controller');

const router = express.Router();

router.post('/conversation', protect, chatController.createOrGetConversation);
router.get('/conversation/:propertyId', protect, chatController.getConversationByProperty);
router.get('/messages/:conversationId', protect, chatController.getMessages);
router.get('/conversations', protect, chatController.getUserConversations); // useful for the chat UI sidebar
router.put('/conversations/:conversationId/read', protect, chatController.markAsRead);
router.get('/unread-count', protect, chatController.getUnreadCount);

module.exports = router;
