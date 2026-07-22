const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: String,
    password: {
      type: String,
      required: true
    },
    // googleId: { type: String, default: '' },
    avatar: String,
    status: {
      type: String,
      default: "active"
    },
    deleted: {
      type: Boolean,
      default: false
    },
    deletedBy: String,
    deletedAt: Date
  },
  {
    timestamps: true
  }
)
const User = mongoose.model('User', schema, 'users');

module.exports = User;
