const authService = require('./auth.service');

/**
 * Controller to handle signup OTP request
 */
const requestSignupOTP = async (req, res, next) => {
    try {
        const { phone, password } = req.body;
        const result = await authService.requestSignupOTP(phone, password);
        res.status(201).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
    next(error);
}

};

/**
 * Controller to handle signup OTP verification
 */
const verifySignupOTP = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;
        const user = await authService.verifySignupOTP(phone, otp);
        res.status(201).json({
            success: true,
            message: 'User created successfully', // or "Signup verified"
            data: user
        });
    } catch (error) {
    next(error);
    }

};

module.exports = {
    requestSignupOTP,
    verifySignupOTP,
};
