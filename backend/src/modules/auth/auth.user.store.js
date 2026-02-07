const users = [];

/**
 * Find user by phone
 */
const findUserByPhone = (phone) => {
    return users.find(user => user.phone === phone);
};

/**
 * Find user by email
 */
const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

/**
 * Create user
 */
const createUser = (userData) => {
    users.push(userData);
    return userData;
};

module.exports = {
    findUserByPhone,
    findUserByEmail,
    createUser
};
