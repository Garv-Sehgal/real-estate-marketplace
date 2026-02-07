const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRY }
    );
};

const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRY }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};
