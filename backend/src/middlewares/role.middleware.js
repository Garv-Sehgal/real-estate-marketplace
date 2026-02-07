const { ROLE_LEVEL } = require('../config/roles');

const requireRole = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const userRoleLevel = ROLE_LEVEL[req.user.role];

        const hasAccess = allowedRoles.some(role => {
            return userRoleLevel >= ROLE_LEVEL[role];
        });

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: insufficient permissions'
            });
        }

        next();
    };
};

module.exports = requireRole;
