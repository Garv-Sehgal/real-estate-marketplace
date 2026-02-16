const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { createUser, findUserByEmail, findUserByPhone } = require('../auth/auth.user.store');
const { ROLES } = require('../../config/roles');
const User = require('../auth/auth.user.model');

/**
 * CREATE ADMIN / STAFF
 */
const createAdmin = async (data) => {

    const { fullName, email, password, role, phone } = data;

    if (!fullName || !email || !password || !role) {
        throw new Error('Missing required fields');
    }

    // Only admin or staff can be created here
    const ALLOWED_ADMIN_ROLES = [ROLES.ADMIN, ROLES.STAFF];

    if (!ALLOWED_ADMIN_ROLES.includes(role)) {
        throw new Error('Invalid admin role selection');
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
        throw new Error('Email already registered');
    }

    // Normalize phone (optional)
    const normalizedPhone = phone ? phone.trim() : undefined;

    // Check duplicate phone if provided
    if (normalizedPhone) {
        const existingPhoneUser = await findUserByPhone(normalizedPhone);
        if (existingPhoneUser) {
            throw new Error('Phone already registered');
        }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_ROUNDS) || 10
    );

    const newAdmin = await createUser({
        id: crypto.randomUUID(),
        fullName,
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
        role,
        status: 'active',
        createdAt: new Date().toISOString()
    });

    const { passwordHash: _, ...safeAdmin } = newAdmin.toObject();

    return safeAdmin;
};


/**
 * SUSPEND ADMIN / STAFF
 */
const suspendAdmin = async (identifier) => {

    if (!identifier) {
        throw new Error('Identifier required');
    }

    let user;

    // Detect email vs phone
    if (identifier.includes('@')) {
        user = await findUserByEmail(identifier.toLowerCase().trim());
    } else {
        user = await findUserByPhone(identifier.trim());
    }

    if (!user) {
        throw new Error('User not found');
    }

    // Only admin or staff allowed
    if (![ROLES.ADMIN, ROLES.STAFF].includes(user.role)) {
        throw new Error('Only admin or staff can be suspended');
    }

    if (user.status === 'suspended') {
        return { message: 'User already suspended' };
    }

    user.status = 'suspended';
    await user.save();

    return { message: 'User suspended successfully' };
};

module.exports = {
    createAdmin,
    suspendAdmin
};
