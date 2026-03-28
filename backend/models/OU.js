/** @format */

const mongoose = require('mongoose');

// Organisational Unit Schema
const OUSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('OU', OUSchema);
