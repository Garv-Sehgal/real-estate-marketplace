const User = require('./auth.user.model');

/**
 * Find user by phone
 */
const findUserByPhone = async (phone) => {
  return await User.findOne({ phone: phone.trim() });
};

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase().trim() });
};

/**
 * Create user
 */
const createUser = async (userData) => {
  try {
    const user = new User(userData);
    return await user.save();
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw new Error(`${field} already exists`);
    }
    throw error;
  }
};

module.exports = {
  findUserByPhone,
  findUserByEmail,
  createUser
};
