const authService = require('./auth.service');

/**
 * Controller to handle signup OTP request
 */
const requestSignupOTP = async (req, res, next) => {
    try {
        const result = await authService.requestSignupOTP(req.body);
        res.status(201).json({
            success: true,
            ...result
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
        const { signupId, phoneOtp, emailOtp } = req.body;
        const user = await authService.verifySignupOTP(signupId, phoneOtp, emailOtp);
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
