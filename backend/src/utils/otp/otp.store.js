const otpMap = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Store OTP for a phone number with expiration
 * @param {string} phone - User's phone number
 * @param {string} otp - Generated OTP
 * @param {any} [data=null] - Optional data to store (e.g. hashed password)
 */
const storeOTP = (phone, otp, data = null) => {
    // Prevent OTP spam
if (otpMap.has(phone)) {
    const existing = otpMap.get(phone);

    if (Date.now() < existing.expiresAt) {
        throw new Error('OTP already sent. Please wait before requesting again.');
    }
}

    const entry = {
        otp,
        data,
        attempts: 0,
        expiresAt: Date.now() + OTP_EXPIRY_MS, // 5 minutes
    };
    otpMap.set(phone, entry);

    // Auto-expire
    setTimeout(() => {
        if (otpMap.has(phone)) {
            const currentEntry = otpMap.get(phone);
            // Ensure we are deleting the same OTP instance (simple check)
            if (currentEntry && currentEntry.otp === otp) {
                otpMap.delete(phone);
            }
        }
    }, OTP_EXPIRY_MS);
};

/**
 * Verify OTP and retrieve stored data
 * @param {string} phone - User's phone number
 * @param {string} otp - OTP to verify
 * @returns {any|null} Stored data if valid, null otherwise
 */
const verifyOTP = (phone, otp) => {
    if (!otpMap.has(phone)) {
        return null;
    }

    const entry = otpMap.get(phone);
    // Block brute-force attempts
if (entry.attempts >= 5) {
    otpMap.delete(phone);
    return null;
}

entry.attempts++;


    if (Date.now() > entry.expiresAt) {
        otpMap.delete(phone);
        return null;
    }

    if (entry.otp === otp) {
        otpMap.delete(phone); // Prevent reuse
        return entry.data ?? true;
    }

    return null;
};

module.exports = {
    storeOTP,
    verifyOTP,
};
