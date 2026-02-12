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

//login function
const login = async (req, res) => {
    try {

        const { identifier, password } = req.body;

        const result = await authService.loginUser(identifier, password);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result
        });

    } catch (error) {

        res.status(401).json({
            success: false,
            message: error.message
        });

    }
};

const logout = async (req, res, next) => {
    try {

        const userId = req.user.userId;

        const result = await authService.logoutUser(userId);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    requestSignupOTP,
    verifySignupOTP,
    login,
    logout
};
