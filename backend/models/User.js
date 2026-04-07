/** @format */

// Import mongoose
const mongoose = require('mongoose');

// Create User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // No duplicate usernames
  },
  password: {
    type: String,
    required: true, // Will be hashed later
  },
  role: {
    type: String,
    enum: ['normal', 'management', 'admin'], // Roles from PDF
    default: 'normal',
  },
  ous: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OU', // Links user to organizational units
    },
  ],
  divisions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Division', // Links user to divisions
    },
  ],
});

// Export model
module.exports = mongoose.model('User', UserSchema);
