const pendingUsers = new Map();
const crypto = require('crypto');

const PENDING_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Create a pending user
 */
const createPendingUser = (signupId, data) => {
    const entry = {
        ...data,
        phoneVerified: false,
        emailVerified: false,
        expiresAt: Date.now() + PENDING_EXPIRY_MS
    };

    pendingUsers.set(signupId, entry);

    // Auto-delete after expiry
    setTimeout(() => {
        pendingUsers.delete(signupId);
    }, PENDING_EXPIRY_MS);
};


/**
 * Get pending user
 */
const getPendingUser = (signupId) => {
    const user = pendingUsers.get(signupId);

    if (!user) return null;

    if (Date.now() > user.expiresAt) {
        pendingUsers.delete(signupId);
        return null;
    }

    return user;
};


/**
 * Mark phone verified
 */
const markPhoneVerified = (signupId) => {
    const user = pendingUsers.get(signupId);
    if (!user) return;

    user.phoneVerified = true;
};


/**
 * Mark email verified
 */
const markEmailVerified = (signupId) => {
    const user = pendingUsers.get(signupId);
    if (!user) return;

    user.emailVerified = true;
};


/**
 * Delete after success
 */
const deletePendingUser = (signupId) => {
    pendingUsers.delete(signupId);
};


module.exports = {
    createPendingUser,
    getPendingUser,
    markPhoneVerified,
    markEmailVerified,
    deletePendingUser
};
