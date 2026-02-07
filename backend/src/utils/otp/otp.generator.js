const crypto = require('crypto');

/**
 * Generate a secure 6-digit numeric OTP
 * @returns {string} 6-digit OTP
 */
const generateOTP = () => {
    const otp = crypto.randomInt(100000, 1000000);
    return otp.toString();
};

module.exports = { generateOTP };
