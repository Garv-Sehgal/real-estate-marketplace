const Message = require('./models/message.model');
const Conversation = require('./models/conversation.model');
const User = require('../auth/auth.user.model');
const Property = require('../property/property.model');

module.exports = (io) => {
    // We expect clients to send their JWT or user ID upon connection, but for simplicity,
    // we assume the auth happens when they join a room (conversationId).
    
    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('join_conversation', (conversationId) => {
            console.log(`Socket ${socket.id} joining room ${conversationId}`);
            socket.join(conversationId);
        });

        socket.on('send_message', async (data) => {
            try {
                const { conversationId, senderId, receiverId, propertyId, encryptedMessage, replyTo } = data;

                const sender = await User.findOne({ id: senderId });
                const receiver = await User.findOne({ id: receiverId });
                const property = propertyId ? await Property.findOne({ id: propertyId }) : null;

                if (!sender || !receiver) throw new Error('Invalid sender or receiver');

                // 1. Save message to DB
                const message = await Message.create({
                    conversationId,
                    senderId: sender._id,
                    receiverId: receiver._id,
                    propertyId: property ? property._id : null,
                    encryptedMessage,
                    replyTo: replyTo || null
                });

                // 2. Update conversation lastMessage
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: encryptedMessage,
                    updatedAt: Date.now()
                });

                // 3. Broadcast to others in room
                // io.to(room) sends to all sockets in the room
                io.to(conversationId).emit('receive_message', message);
                
            } catch (error) {
                console.error('Socket message error:', error);
                // Optionally emit error back to sender
                socket.emit('message_error', { error: 'Failed to send message' });
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};
