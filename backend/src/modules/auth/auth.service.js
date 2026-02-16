const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const { generateOTP } = require('../../utils/otp/otp.generator');
const { storeOTP, verifyOTP } = require('../../utils/otp/otp.store');
const { validatePhone, validatePassword } = require('./auth.validation');
const { createPendingUser, getPendingUser, deletePendingUser } = require('./auth.pending.store');
const { findUserByPhone, findUserByEmail, createUser } = require('./auth.user.store');
const { normalizePhone } = require('../../utils/phone/phone.util');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokens/token.generator');
const { storeRefreshToken, verifyRefreshToken, deleteRefreshToken } = require('./auth.refresh.store');
const { SELF_REGISTER_ROLES } = require('../../config/roles');


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


module.exports = {
    requestSignupOTP,
    verifySignupOTP,
    loginUser,
    logoutUser
};
