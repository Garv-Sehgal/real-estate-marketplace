// userId -> refreshToken
const refreshTokens = new Map();

const storeRefreshToken = (userId, token) => {
    refreshTokens.set(userId, token);
};

const verifyRefreshToken = (userId, token) => {
    const storedToken = refreshTokens.get(userId);

    return storedToken === token;
};

const deleteRefreshToken = (userId) => {
    refreshTokens.delete(userId);
};

module.exports = {
    storeRefreshToken,
    verifyRefreshToken,
    deleteRefreshToken
};
