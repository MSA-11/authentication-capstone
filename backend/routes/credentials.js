/** @format */

// Import required modules
const express = require('express');
const router = express.Router();

// Import models
const Credential = require('../models/Credential');
const Division = require('../models/Division');

// Import middleware
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// =======================================
// 1. VIEW CREDENTIALS (WITH PERMISSIONS)
// =======================================
router.get('/:divisionId', auth, async (req, res) => {
  try {
    const { divisionId } = req.params;

    // Check if user belongs to this division
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Fetch credentials for this division
    const credentials = await Credential.find({ division: divisionId });

    res.json(credentials);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =======================================
// 2. ADD CREDENTIAL (NORMAL + MANAGEMENT)
// =======================================
router.post(
  '/',
  auth,
  checkRole(['normal', 'management', 'admin']),
  async (req, res) => {
    try {
      const { site, username, password, division } = req.body;

      // Create new credential
      const newCredential = new Credential({
        site,
        username,
        password,
        division,
      });

      await newCredential.save();

      res.json(newCredential);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// =======================================
// 3. UPDATE CREDENTIAL (MANAGEMENT ONLY)
// =======================================
router.put(
  '/:id',
  auth,
  checkRole(['management', 'admin']),
  async (req, res) => {
    try {
      const { site, username, password } = req.body;

      // Find and update credential
      const updatedCredential = await Credential.findByIdAndUpdate(
        req.params.id,
        { site, username, password },
        { new: true }
      );

      res.json(updatedCredential);
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
