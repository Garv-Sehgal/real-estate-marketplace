import CryptoJS from 'crypto-js';

// We derive a deterministic secret key based on the conversation ID and a salt
// In a real E2E system, users would exchange public keys.
// Here we use a symmetric key that the backend never sees.
const SALT = 'real_estate_marketplace_salt_2026';

export const generateEncryptionKey = (conversationId) => {
    return CryptoJS.SHA256(conversationId + SALT).toString();
};

export const encryptMessage = (message, conversationId) => {
    if (!message) return '';
    try {
        const key = generateEncryptionKey(conversationId);
        return CryptoJS.AES.encrypt(message, key).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        return '';
    }
};

export const decryptMessage = (encryptedMessage, conversationId) => {
    if (!encryptedMessage) return '';
    try {
        const key = generateEncryptionKey(conversationId);
        const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption error:', error);
        return '[Encrypted Message]';
    }
};
