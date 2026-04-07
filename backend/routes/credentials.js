/** @format */

// Import Express (used to create routes)
const express = require('express');

// Create router
const router = express.Router();

// Import mongoose (needed for ObjectId conversion)
const mongoose = require('mongoose');

// Import Credential model
const Credential = require('../models/Credential.js');

// Import auth middleware (protect routes)
const auth = require('../middleware/authMiddleware.js');

// ==========================
// GET ALL CREDENTIALS
// ==========================
router.get('/', auth, async (req, res) => {
  try {
    console.log('USER DIVISIONS:', req.user.divisions); // DEBUG

    // Find credentials linked to user's division
    const credentials = await Credential.find({
      division: { $in: req.user.divisions },
    });

    console.log('Found Credentials:', credentials); // DEBUG

    // Send data to frontend
    res.json(credentials);
  } catch (err) {
    console.log('GET ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================
// ADD NEW CREDENTIAL
// ==========================
router.post('/', auth, async (req, res) => {
  try {
    // DEBUG — VERY IMPORTANT
    console.log('REQ BODY:', req.body);

    //Extract fields from request body
    const { site, username, password, division } = req.body;

    // Validate inputs
    if (!site || !username || !password || !division) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    //SAFE objectId conversion (MUST be ObjectId for MongoDB)
    if (!mongoose.Types.ObjectId.isValid(division)) {
      return res.status(400).json({
        message: 'Invalid division ID',
      });
    }

    // Create new credential
    const newCredential = new Credential({
      site: site, // Website name
      username: username, // Login username
      password: password, // Login password
      division: division, // MUST be ObjectId 'store the division ID directly.'
    });

    // Save to database
    await newCredential.save();

    console.log('SAVED:', newCredential);

    // Success response
    res.json(newCredential);
  } catch (error) {
    console.log('POST ERROR:', error);

    res.status(500).json({ message: 'Server error while adding credential' });
  }
});

// ==========================
// UPDATE CREDENTIAL
// ==========================
router.put('/:id', auth, async (req, res) => {
  try {
    // Get ID from URL
    const { id } = req.params;

    // Get updated values
    const { site, username, password } = req.body;

    // Validate input (IMPORTANT FIX)
    if (!site || !username || !password) {
      return res.status(400).json({
        message: 'All fields are required for update',
      });
    }

    // Update credential
    const updatedCredential = await Credential.findByIdAndUpdate(
      id,
      {
        site: site,
        username: username,
        password: password,
      },
      {
        new: true, // Return updated document
      }
    );

    // If not found
    if (!updatedCredential) {
      return res.status(404).json({
        message: 'Credential not found',
      });
    }

    // Success
    res.json({
      message: 'Credential updated successfully',
      updatedCredential,
    });
  } catch (error) {
    console.log('UPDATE ERROR:', error);

    res.status(500).json({
      message: 'Server error while updating',
    });
  }
});

// Export router
module.exports = router;
