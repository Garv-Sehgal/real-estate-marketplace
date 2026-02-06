const refreshTokenMap = new Map();

const storeRefreshToken = (userId, token) => {
    refreshTokenMap.set(userId, token);
};

const getRefreshToken = (userId) => {
    return refreshTokenMap.get(userId);
};

const deleteRefreshToken = (userId) => {
    refreshTokenMap.delete(userId);
};

module.exports = {
    storeRefreshToken,
    getRefreshToken,
    deleteRefreshToken
};
