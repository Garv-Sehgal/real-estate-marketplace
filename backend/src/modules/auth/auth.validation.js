const validator = require('validator');

/**
 * Validate phone number (E.164 format or generic international)
 * @param {string} phone
 * @returns {string|null} Error message or null if valid
 */
const validatePhone = (phone) => {
    if (!phone || typeof phone !== 'string') {
        return 'Phone number is required';
    }
    // Using validator.isMobilePhone loosely to support various international formats
    // Or simpler regex check if validator is too strict for specific region
    // Going with validator's strict mode false for flexibility initially
    if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
        return 'Invalid phone number format';
    }
    return null;
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {string|null} Error message or null if valid
 */
const validatePassword = (password) => {
    if (!password || typeof password !== 'string') {
        return 'Password is required';
    }
    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    return null;
};

module.exports = {
    validatePhone,
    validatePassword,
};
