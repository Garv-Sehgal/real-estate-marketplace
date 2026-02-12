const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { createUser, findUserByEmail } = require('../modules/auth/auth.user.store');
const { ROLES } = require('./roles');

const seedSuperAdmin = async () => {

    // Only seed in development
    if (process.env.NODE_ENV !== 'development') {
        return;
    }

    const existingAdmin = findUserByEmail('super@admin.com');

    if (existingAdmin) {
        return;
    }

    const passwordHash = await bcrypt.hash('admin123', 10);

    createUser({
        id: crypto.randomUUID(),
        fullName: 'Super Admin',
        phone: '+911234567890',
        email: 'super@admin.com',
        passwordHash,
        role: ROLES.SUPER_ADMIN,
        status: 'active',
        createdAt: new Date().toISOString()
    });

    console.log('Super Admin seeded (development only)');
};

module.exports = { seedSuperAdmin };
