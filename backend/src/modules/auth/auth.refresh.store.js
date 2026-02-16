const User = require('./auth.user.model');

const storeRefreshToken = async (userId, token, expiresAt) => {
    await User.findOneAndUpdate(
        { id: userId },
        {
            refreshToken: token,
            refreshTokenExpiresAt: expiresAt
        }
    );
};

const verifyRefreshToken = async (userId, token) => {
    const user = await User.findOne({ id: userId });

    if (!user) return false;
    if (!user.refreshToken) return false;
    if (user.refreshToken !== token) return false;
    if (!user.refreshTokenExpiresAt) return false;
    if (user.refreshTokenExpiresAt < new Date()) return false;

    return true;
};

const deleteRefreshToken = async (userId) => {
    await User.findOneAndUpdate(
        { id: userId },
        {
            refreshToken: null,
            refreshTokenExpiresAt: null
        }
    );
};

module.exports = {
    storeRefreshToken,
    verifyRefreshToken,
    deleteRefreshToken
};
