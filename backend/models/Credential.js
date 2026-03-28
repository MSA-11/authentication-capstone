/** @format */

const mongoose = require('mongoose');

// Credential Schema
const CredentialSchema = new mongoose.Schema({
  site: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  division: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Division', // Credential belongs to a division
  },
});

module.exports = mongoose.model('Credential', CredentialSchema);
