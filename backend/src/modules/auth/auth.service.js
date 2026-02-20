const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const { generateOTP } = require('../../utils/otp/otp.generator');
const { storeOTP, verifyOTP } = require('../../utils/otp/otp.store');
const { validatePhone, validatePassword } = require('./auth.validation');
const { createPendingUser, getPendingUser, deletePendingUser } = require('./auth.pending.store');
const { findUserByPhone, findUserByEmail, createUser, findUserById, updateUserPassword, updateUserById } = require('./auth.user.store');
const { normalizePhone } = require('../../utils/phone/phone.util');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokens/token.generator');
const { storeRefreshToken, verifyRefreshToken, deleteRefreshToken } = require('./auth.refresh.store');
const { SELF_REGISTER_ROLES } = require('../../config/roles');
const { sendEmailOTP } = require('../../utils/email/email.sender');
const { sendSMSOTP } = require('../../utils/sms/sms.sender');
const { createResetSession } = require('./auth.reset.store');

/**
 * REQUEST SIGNUP OTP
 */
const requestSignupOTP = async (data) => {

    const { fullName, phone, email, password, role } = data;

    if (!fullName || !phone || !email || !password || !role) {
        throw new Error('All fields are required');
    }

    const normalizedPhone = normalizePhone(phone);
    const normalizedEmail = email.trim().toLowerCase();

    const phoneError = validatePhone(normalizedPhone);
    if (phoneError) throw new Error(phoneError);

    if (!validator.isEmail(normalizedEmail)) {
        throw new Error('Valid email is required');
    }

    if (!SELF_REGISTER_ROLES.includes(role)) {
        throw new Error('Invalid role selection');
    }

    const passwordError = validatePassword(password);
    if (passwordError) throw new Error(passwordError);

    // DB duplicate checks
    if (await findUserByPhone(normalizedPhone)) {
        throw new Error('Phone already registered');
    }

    if (await findUserByEmail(normalizedEmail)) {
        throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_ROUNDS) || 10
    );

    const signupId = crypto.randomUUID();

    createPendingUser(signupId, {
        fullName,
        phone: normalizedPhone,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role
    });

    const phoneOtp = generateOTP();
const emailOtp = generateOTP();

storeOTP(`phone:${normalizedPhone}`, phoneOtp);
storeOTP(`email:${normalizedEmail}`, emailOtp);

// send OTPs
await sendEmailOTP(normalizedEmail, emailOtp);

try {
    await sendSMSOTP(normalizedPhone, phoneOtp);
} catch (err) {
    console.warn("SMS failed but email sent:", err.message);
}

return { message: 'OTP sent successfully', signupId };

};



/**
 * VERIFY SIGNUP OTP
 */
const verifySignupOTP = async (signupId, phoneOtp, emailOtp) => {

    if (!signupId || !phoneOtp || !emailOtp) {
        throw new Error('Invalid verification request');
    }

    const pendingUser = getPendingUser(signupId);

    if (!pendingUser) {
        throw new Error('Signup expired or invalid');
    }

    const { phone, email, fullName, passwordHash, role } = pendingUser;

    const phoneValid = verifyOTP(`phone:${phone}`, phoneOtp);
    const emailValid = verifyOTP(`email:${email}`, emailOtp);

    if (!phoneValid || !emailValid) {
        throw new Error('Invalid or expired OTP');
    }

    const newUser = await createUser({
        id: crypto.randomUUID(),
        fullName,
        phone,
        email,
        passwordHash,
        role,
        status: 'active',
        createdAt: new Date().toISOString()
    });

    deletePendingUser(signupId);

    // AUTO LOGIN AFTER SIGNUP
    const accessToken = generateAccessToken({
        userId: newUser.id,
        role: newUser.role
    });

    const refreshToken = generateRefreshToken({
        userId: newUser.id,
        role: newUser.role
    });

    storeRefreshToken(newUser.id, refreshToken);

    const { passwordHash: _, ...safeUser } = newUser.toObject();

    return {
        user: safeUser,
        accessToken,
        refreshToken
    };
};



/**
 * LOGIN USER
 */
const loginUser = async (identifier, password) => {

    if (!identifier || !password) {
        throw new Error('Identifier and password are required');
    }

    let user;

    const normalizedIdentifier = identifier.trim().toLowerCase();

    if (normalizedIdentifier.includes('@')) {
        user = await findUserByEmail(normalizedIdentifier);
    } else {
        const normalizedPhone = normalizePhone(normalizedIdentifier);
        user = await findUserByPhone(normalizedPhone);
    }

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // 🚫 BLOCK SUSPENDED USERS
    if (user.status === 'suspended') {
        throw new Error('Account suspended. Contact super admin.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    const accessToken = generateAccessToken({
        userId: user.id,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        userId: user.id,
        role: user.role
    });

    storeRefreshToken(user.id, refreshToken);

    const { passwordHash: _, ...safeUser } = user.toObject();

    return {
        user: safeUser,
        accessToken,
        refreshToken
    };
};



/**
 * LOGOUT USER
 */
const logoutUser = async (userId) => {

    deleteRefreshToken(userId);

    return { message: 'Logged out successfully' };
};

/**
 * CHANGE PASSWORD (LOGGED-IN USER)
 */
const changePassword = async (userId, currentPassword, newPassword) => {

    if (!currentPassword || !newPassword) {
        throw new Error('Current password and new password are required');
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) throw new Error(passwordError);

    const user = await findUserById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
        throw new Error('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(
        newPassword,
        Number(process.env.BCRYPT_ROUNDS) || 10
    );

    await updateUserPassword(userId, newPasswordHash);

    return { message: 'Password changed successfully' };
};

/**
 * REQUEST PASSWORD RESET OTP
 */
const requestPasswordResetOTP = async (identifier) => {

    if (!identifier) {
        throw new Error('Email or phone is required');
    }

    let user;
    let contactKey;
    let contactValue;

    const normalizedIdentifier = identifier.trim().toLowerCase();

    // email flow
    if (normalizedIdentifier.includes('@')) {

        user = await findUserByEmail(normalizedIdentifier);

        if (!user) {
            throw new Error('Account not found');
        }

        contactKey = `email:${user.email}`;
        contactValue = user.email;

        const otp = generateOTP();
        storeOTP(contactKey, otp);

        await sendEmailOTP(contactValue, otp);

    }
    // phone flow
    else {

        const normalizedPhone = normalizePhone(normalizedIdentifier);

        user = await findUserByPhone(normalizedPhone);

        if (!user) {
            throw new Error('Account not found');
        }

        contactKey = `phone:${user.phone}`;
        contactValue = user.phone;

        const otp = generateOTP();
        storeOTP(contactKey, otp);

        try {
            await sendSMSOTP(contactValue, otp);
        } catch (err) {
            console.warn("SMS failed:", err.message);
        }
    }

    return { message: 'Password reset OTP sent' };
};

/**
 * VERIFY PASSWORD RESET OTP
 */
const verifyPasswordResetOTP = async (identifier, otp) => {

    if (!identifier || !otp) {
        throw new Error('Identifier and OTP are required');
    }

    let user;
    let contactKey;

    const normalizedIdentifier = identifier.trim().toLowerCase();

    // email flow
    if (normalizedIdentifier.includes('@')) {

        user = await findUserByEmail(normalizedIdentifier);

        if (!user) {
            throw new Error('Account not found');
        }

        contactKey = `email:${user.email}`;
    }
    // phone flow
    else {

        const normalizedPhone = normalizePhone(normalizedIdentifier);

        user = await findUserByPhone(normalizedPhone);

        if (!user) {
            throw new Error('Account not found');
        }

        contactKey = `phone:${user.phone}`;
    }

    const valid = verifyOTP(contactKey, otp);

    if (!valid) {
        throw new Error('Invalid or expired OTP');
    }

    const resetToken = crypto.randomUUID();

    createResetSession(resetToken, user.id);

    return {
        message: 'OTP verified successfully',
        resetToken
    };
};

/**
 * SET NEW PASSWORD AFTER RESET TOKEN
 */
const setNewPassword = async (resetToken, newPassword) => {

    if (!resetToken || !newPassword) {
        throw new Error('Reset token and new password are required');
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) throw new Error(passwordError);

    const { getResetSession, deleteResetSession } = require('./auth.reset.store');

    const session = getResetSession(resetToken);

    if (!session) {
        throw new Error('Reset session expired or invalid');
    }

    const user = await findUserById(session.userId);

    if (!user) {
        throw new Error('User not found');
    }

    const newPasswordHash = await bcrypt.hash(
        newPassword,
        Number(process.env.BCRYPT_ROUNDS) || 10
    );

    await updateUserPassword(user.id, newPasswordHash);

    deleteResetSession(resetToken);

    return { message: 'Password reset successful' };
};

/**
 * GET CURRENT USER PROFILE
 */
const getMe = async (userId) => {

    const user = await findUserById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    const { passwordHash, ...safeUser } = user.toObject();

    return safeUser;
};

/**
 * UPDATE CURRENT USER PROFILE
 */
const updateMe = async (userId, data) => {

    const user = await findUserById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    const updateData = {};

    if (data.fullName !== undefined) {
        if (!data.fullName.trim()) {
            throw new Error('Full name cannot be empty');
        }
        updateData.fullName = data.fullName.trim();
    }

    if (Object.keys(updateData).length === 0) {
        throw new Error('No valid fields to update');
    }

    const updatedUser = await updateUserById(userId, updateData);

    const { passwordHash, ...safeUser } = updatedUser.toObject();

    return safeUser;
};

module.exports = {
    requestSignupOTP,
    verifySignupOTP,
    loginUser,
    logoutUser,
    changePassword,
    requestPasswordResetOTP,
    verifyPasswordResetOTP,
    setNewPassword,
    getMe,
    updateMe
};
