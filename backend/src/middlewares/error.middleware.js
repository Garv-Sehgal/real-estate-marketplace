const config = require('../config/env');

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: config.nodeEnv === 'development' ? err.stack : undefined,
    });
};

module.exports = errorHandler;
