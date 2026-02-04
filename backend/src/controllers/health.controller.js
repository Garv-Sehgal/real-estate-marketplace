const getHealth = (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Server is healthy',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHealth,
};
