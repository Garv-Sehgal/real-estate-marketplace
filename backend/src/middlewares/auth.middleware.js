const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // Expecting: Bearer TOKEN
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        if (!process.env.JWT_ACCESS_SECRET) {
    throw new Error("JWT secret not configured");
}
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );

        // Attach user info to request
        req.user = decoded;

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });

    }
};

module.exports = authMiddleware;
