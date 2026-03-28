/** @format */

const mongoose = require('mongoose');

// Division Schema
const DivisionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ou: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OU', // Each division belongs to an OU
  },
});

module.exports = mongoose.model('Division', DivisionSchema);
