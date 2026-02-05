const bcrypt = require('bcryptjs');
const { generateOTP } = require('../../utils/otp/otp.generator');
const { storeOTP, verifyOTP } = require('../../utils/otp/otp.store');
const { validatePhone, validatePassword } = require('./auth.validation');
const { createPendingUser, getPendingUser, deletePendingUser } = require('./auth.pending.store');
const { findUserByPhone, findUserByEmail, createUser } = require('./auth.user.store');
const crypto = require('crypto');


/**
 * Service to handle OTP request for signup
 * @param {string} phone 
 * @param {string} password 
 * @returns {object} Result object
 */
const requestSignupOTP = async (data) => {
    const { fullName, phone, email, password, role } = data;

    // Validate input
    const phoneError = validatePhone(phone);
    if (phoneError) throw new Error(phoneError);

    if (!email || !email.includes('@')) {
    throw new Error('Valid email is required');
}

const ALLOWED_ROLES = ['buyer', 'agent', 'landlord', 'tenant'];

if (!ALLOWED_ROLES.includes(role)) {
    throw new Error('Invalid role selected');
}

    const passwordError = validatePassword(password);
    if (passwordError) throw new Error(passwordError);

    // Prevent duplicate registrations
if (findUserByPhone(phone)) {
    throw new Error('Phone already registered');
}

if (findUserByEmail(email)) {
    throw new Error('Email already registered');
}

    // Hash password
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 10);

    // Generate signup lifecycle ID
    const signupId = crypto.randomUUID();

    // Create pending user (DO NOT create permanent user yet)
    createPendingUser(signupId, {
        fullName,
        phone,
        email,
        passwordHash: hashedPassword,
        role
});

// Generate OTP
const phoneOtp = generateOTP();
const emailOtp = generateOTP();

storeOTP(phone, phoneOtp);
storeOTP(email, emailOtp);



    return { message: 'OTP sent successfully', signupId }; // Returning OTP for testing purposes
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
    const phoneValid = verifyOTP(phone, phoneOtp);
    const emailValid = verifyOTP(email, emailOtp);

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

    return newUser;
};


module.exports = {
    requestSignupOTP,
    verifySignupOTP,
};
