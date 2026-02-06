const otpMap = new Map();
const OTP_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Store OTP for a key number with expiration
 * @param {string} key - User's key number
 * @param {string} otp - Generated OTP
 * @param {any} [data=null] - Optional data to store (e.g. hashed password)
 */
const storeOTP = (key, otp, data = null) => {
    // Prevent OTP spam
if (otpMap.has(key)) {
    const existing = otpMap.get(key);

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

    // OTP enabling
if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV OTP] ${key} -> ${otp}`);
}

    otpMap.set(key, entry);


    // Auto-expire
    setTimeout(() => {
        if (otpMap.has(key)) {
            const currentEntry = otpMap.get(key);
            // Ensure we are deleting the same OTP instance (simple check)
            if (currentEntry && currentEntry.otp === otp) {
                otpMap.delete(key);
            }
        }
    }, OTP_EXPIRY_MS);
};

/**
 * Verify OTP and retrieve stored data
 * @param {string} key - User's key number
 * @param {string} otp - OTP to verify
 * @returns {any|null} Stored data if valid, null otherwise
 */
const verifyOTP = (key, otp) => {
    if (!otpMap.has(key)) {
        return null;
    }

    const entry = otpMap.get(key);
    // Block brute-force attempts
if (entry.attempts >= 5) {
    otpMap.delete(key);
    return null;
}

entry.attempts++;


    if (Date.now() > entry.expiresAt) {
        otpMap.delete(key);
        return null;
    }

    if (entry.otp === otp) {
        otpMap.delete(key); // Prevent reuse
        return entry.data ?? true;
    }

    return null;
};

module.exports = {
    storeOTP,
    verifyOTP,
};
