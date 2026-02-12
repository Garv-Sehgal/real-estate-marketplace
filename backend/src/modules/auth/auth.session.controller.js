const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokens/token.generator');
const { verifyRefreshToken, storeRefreshToken } = require('./auth.refresh.store');

const refreshSession = async (req, res) => {

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Refresh token required'
        });
    }

    try {

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const isValid = verifyRefreshToken(decoded.userId, refreshToken);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // 🔥 ROTATION HAPPENS HERE

        const newAccessToken = generateAccessToken({
            userId: decoded.userId,
            role: decoded.role
        });

        const newRefreshToken = generateRefreshToken({
            userId: decoded.userId,
            role: decoded.role
        });

        storeRefreshToken(decoded.userId, newRefreshToken);

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token'
        });

    }
};

module.exports = {
    refreshSession
};
