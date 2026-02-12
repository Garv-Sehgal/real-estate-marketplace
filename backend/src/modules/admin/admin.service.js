const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { createUser, findUserByEmail } = require('../auth/auth.user.store');
const { ROLES } = require('../../config/roles');

const createAdmin = async (data) => {

    const { fullName, email, password, role } = data;
    if (!fullName || !email || !password || !role) {
    throw new Error('Missing required fields');
    }

    // Only admin or staff can be created here
    const ALLOWED_ADMIN_ROLES = [ROLES.ADMIN, ROLES.STAFF];

    if (!ALLOWED_ADMIN_ROLES.includes(role)) {
    throw new Error('Invalid admin role selection');
    }


    // Prevent duplicates
    if (findUserByEmail(email.toLowerCase())) {
        throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
        password,
        Number(process.env.BCRYPT_ROUNDS) || 10
    );

    const newAdmin = createUser({
        id: crypto.randomUUID(),
        fullName,
        email: email.toLowerCase(),
        phone: null, // optional for admins
        passwordHash,
        role,
        status: 'active',
        createdAt: new Date().toISOString()
    });

    // Never return password
    const { passwordHash: _, ...safeAdmin } = newAdmin;

    return safeAdmin;
};

module.exports = {
    createAdmin
};
