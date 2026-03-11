const Conversation = require('./models/conversation.model');
const Message = require('./models/message.model');
const User = require('../auth/auth.user.model');
const Property = require('../property/property.model');
const mongoose = require('mongoose');

exports.createOrGetConversation = async (req, res, next) => {
    try {
        const { propertyId } = req.body;
        const senderStringId = req.user.userId;

        if (!propertyId) {
            return res.status(400).json({ success: false, message: 'propertyId is required' });
        }

        const property = await Property.findOne({ id: propertyId });
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        const receiverStringId = property.ownerId;

        // Prevent self-messaging
        if (senderStringId === receiverStringId) {
            return res.status(400).json({ success: false, message: 'Cannot start conversation with yourself' });
        }

        const sender = await User.findOne({ id: senderStringId });
        const receiver = await User.findOne({ id: receiverStringId });

        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: 'Participants not found' });
        }

        // Check if conversation already exists
        let conversation = await Conversation.findOne({
            propertyId: property._id,
            participants: { $all: [sender._id, receiver._id] }
        })
        .populate('participants', 'id firstName lastName fullName avatar role')
        .populate('propertyId', 'id title location.city images');

        if (!conversation) {
            conversation = await Conversation.create({
                propertyId: property._id,
                participants: [sender._id, receiver._id]
            });
            
            conversation = await conversation.populate('participants', 'id firstName lastName fullName avatar role');
            conversation = await conversation.populate('propertyId', 'id title location.city images');
        }

        res.status(200).json({
            success: true,
            data: conversation
        });
    } catch (error) {
        next(error);
    }
};

exports.getConversationByProperty = async (req, res, next) => {
    try {
        const { propertyId } = req.params;
        const senderStringId = req.user.userId;

        const property = await Property.findOne({ id: propertyId });
        const sender = await User.findOne({ id: senderStringId });

        if (!property || !sender) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        const conversation = await Conversation.findOne({
            propertyId: property._id,
            participants: sender._id
        })
        .populate('participants', 'id firstName lastName fullName avatar role')
        .populate('propertyId', 'id title location.city images');

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        res.status(200).json({
            success: true,
            data: conversation
        });

    } catch (error) {
        next(error);
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        const { conversationId } = req.params;
        const senderStringId = req.user.userId;
        const sender = await User.findOne({ id: senderStringId });

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        if (!sender || !conversation.participants.includes(sender._id)) {
            return res.status(403).json({ success: false, message: 'Not authorized for this conversation' });
        }

        const messages = await Message.find({ conversationId }).sort('createdAt');

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserConversations = async (req, res, next) => {
    try {
        const senderStringId = req.user.userId;
        const sender = await User.findOne({ id: senderStringId });

        if (!sender) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const conversations = await Conversation.find({ participants: sender._id })
            .populate('participants', 'id firstName lastName fullName avatar role')
            .populate('propertyId', 'id title location.city images')
            .sort('-updatedAt');

        res.status(200).json({
            success: true,
            data: conversations
        });
    } catch (error) {
        next(error);
    }
};
