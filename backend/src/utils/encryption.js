const CryptoJS = require('crypto-js');

const SALT = 'real_estate_marketplace_salt_2026';

const generateEncryptionKey = (conversationId) => {
    return CryptoJS.SHA256(conversationId + SALT).toString();
};

const encryptMessage = (message, conversationId) => {
    if (!message) return '';
    try {
        const key = generateEncryptionKey(conversationId);
        return CryptoJS.AES.encrypt(message, key).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        return '';
    }
};

module.exports = { encryptMessage };
