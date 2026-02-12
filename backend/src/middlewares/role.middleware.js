const { ROLE_LEVEL } = require('../config/roles');

const requireLevel = (requiredLevel) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const userRole = req.user.role;
        const userLevel = ROLE_LEVEL[userRole];

        if (!userLevel || userLevel < requiredLevel) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: insufficient permissions'
            });
        }

        next();
    };
};

module.exports = requireLevel;
