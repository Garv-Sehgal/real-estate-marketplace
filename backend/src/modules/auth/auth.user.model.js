const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    index: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['buyer','tenant','landlord','agent','staff','admin','super_admin'],
      required: true
    },
    status: {
      type: String,
      enum: ['active','suspended'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
