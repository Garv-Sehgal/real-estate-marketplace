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

/**
 * Change password (logged-in user)
 */
const changePassword = async (req, res, next) => {
    try {

        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        const result = await authService.changePassword(userId, currentPassword, newPassword);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Request password reset OTP
 */
const requestPasswordResetOTP = async (req, res, next) => {
    try {

        const { identifier } = req.body;

        const result = await authService.requestPasswordResetOTP(identifier);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Verify password reset OTP
 */
const verifyPasswordResetOTP = async (req, res, next) => {
    try {

        const { identifier, otp } = req.body;

        const result = await authService.verifyPasswordResetOTP(identifier, otp);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Set new password after OTP verification
 */
const setNewPassword = async (req, res, next) => {
    try {

        const { resetToken, newPassword } = req.body;

        const result = await authService.setNewPassword(resetToken, newPassword);

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get current logged-in user profile
 */
const getMe = async (req, res, next) => {
    try {

        const userId = req.user.userId;

        const result = await authService.getMe(userId);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Update current logged-in user profile
 */
const updateMe = async (req, res, next) => {
    try {

        const userId = req.user.userId;
        const result = await authService.updateMe(userId, req.body);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    requestSignupOTP,
    verifySignupOTP,
    login,
    logout,
    changePassword,
    requestPasswordResetOTP,
    verifyPasswordResetOTP,
    setNewPassword,
    getMe,
    updateMe
};
