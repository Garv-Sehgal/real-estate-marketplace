const resetSessions = new Map();

const RESET_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Create reset session after OTP verification
 */
const createResetSession = (resetToken, userId) => {

    const entry = {
        userId,
        expiresAt: Date.now() + RESET_EXPIRY_MS
    };

    resetSessions.set(resetToken, entry);

    // auto delete after expiry
    setTimeout(() => {
        resetSessions.delete(resetToken);
    }, RESET_EXPIRY_MS);
};


/**
 * Get reset session
 */
const getResetSession = (resetToken) => {

    const session = resetSessions.get(resetToken);

    if (!session) return null;

    if (Date.now() > session.expiresAt) {
        resetSessions.delete(resetToken);
        return null;
    }

    return session;
};


/**
 * Delete reset session after password update
 */
const deleteResetSession = (resetToken) => {
    resetSessions.delete(resetToken);
};

module.exports = {
    createResetSession,
    getResetSession,
    deleteResetSession
};