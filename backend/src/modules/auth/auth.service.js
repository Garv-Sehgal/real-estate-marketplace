const bcrypt = require('bcryptjs');
const { generateOTP } = require('../../utils/otp/otp.generator');
const { storeOTP, verifyOTP } = require('../../utils/otp/otp.store');
const { validatePhone, validatePassword } = require('./auth.validation');
const { createPendingUser, getPendingUser, deletePendingUser } = require('./auth.pending.store');
const { findUserByPhone, findUserByEmail, createUser } = require('./auth.user.store');
const crypto = require('crypto');
const { normalizePhone } = require('../../utils/phone/phone.util');
const { generateAccessToken, generateRefreshToken } = require('../../utils/tokens/token.generator');
const { storeRefreshToken } = require('./auth.refresh.store');
const { SELF_REGISTER_ROLES } = require('../../config/roles');
const validator = require('validator');

/**
 * Service to handle OTP request for signup
 * @param {string} phone 
 * @param {string} password 
 * @returns {object} Result object
 */
const requestSignupOTP = async (data) => {
    const { fullName, phone, email, password, role } = data;
    const normalizedPhone = normalizePhone(phone);
    const normalizedEmail = email.toLowerCase();


    // Validate input
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

    // Prevent duplicate registrations
if (findUserByPhone(normalizedPhone)) {
    throw new Error('Phone already registered');
}

if (findUserByEmail(normalizedEmail)) {
    throw new Error('Email already registered');
}

    // Hash password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 10);

    // Generate signup lifecycle ID
    const signupId = crypto.randomUUID();

    // Create pending user (DO NOT create permanent user yet)
    createPendingUser(signupId, {
        fullName,
        phone: normalizedPhone,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role
});

// Generate OTP
const phoneOtp = generateOTP();
const emailOtp = generateOTP();

storeOTP(`phone:${normalizedPhone}`, phoneOtp);
storeOTP(`email:${normalizedEmail}`, emailOtp);



    return { message: 'OTP sent successfully', signupId }; // Returning OTP for testing purposes
};


const loginUser = async (identifier, password) => {

    let user;

    // Detect identifier type
    if (identifier.includes('@')) {

    const normalizedEmail = identifier.toLowerCase();
    user = findUserByEmail(normalizedEmail);

} else {

    const normalizedPhone = normalizePhone(identifier);
    user = findUserByPhone(normalizedPhone);

}



    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Generate tokens
    const accessToken = generateAccessToken({
        userId: user.id,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        userId: user.id
    });

    // Store refresh token
    storeRefreshToken(user.id, refreshToken);

    const { passwordHash, ...safeUser } = user;

    return {
    user: safeUser,
    accessToken,
    refreshToken
};
};


/**
 * Service to handle OTP verification for signup
 * @param {string} phone 
 * @param {string} otp 
 * @returns {object} Created user object
 */
const verifySignupOTP = async (signupId, phoneOtp, emailOtp) => {

    // Fetch pending user
    const pendingUser = getPendingUser(signupId);

    if (!pendingUser) {
        throw new Error('Signup expired or invalid');
    }

    const { phone, email, fullName, passwordHash, role } = pendingUser;

    // Verify BOTH OTPs
    const phoneValid = verifyOTP(`phone:${phone}`, phoneOtp);
    const emailValid = verifyOTP(`email:${email}`, emailOtp);

    if (!phoneValid || !emailValid) {
        throw new Error('Invalid or expired OTP');
    }

    // Create permanent user
    const newUser = createUser({
        id: crypto.randomUUID(),
        fullName,
        phone,
        email,
        passwordHash,
        role,
        status: 'active',
        createdAt: new Date().toISOString()
    });

    // Delete pending user
    deletePendingUser(signupId);

   const accessToken = generateAccessToken({
    userId: newUser.id,
    role: newUser.role
});

const refreshToken = generateRefreshToken({
    userId: newUser.id
});

storeRefreshToken(newUser.id, refreshToken);

const { passwordHash: _, ...safeUser } = newUser;

return {
    user: safeUser,
    accessToken,
    refreshToken
};

};


module.exports = {
    requestSignupOTP,
    verifySignupOTP,
    loginUser
};
