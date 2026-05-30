const jwt = require('jsonwebtoken');
const { findUserByEmail } = require('../modules/auth/auth.user.store');
const User = require('../modules/auth/auth.user.model');

const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    // Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    const token = authHeader.split(' ')[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        // 🔒 Fetch latest user state from DB
        const user = await User.findOne({ id: decoded.userId });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // 🚫 Block suspended users
        if (user.status === 'suspended') {
            return res.status(403).json({
                success: false,
                message: 'Account suspended. Contact super admin.'
            });
        }

        req.user = {
            userId: user.id,
            role: user.role
        };

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });

    }
};

module.exports = authMiddleware;
