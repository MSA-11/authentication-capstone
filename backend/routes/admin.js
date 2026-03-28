/** @format */

// Import Express (used to create routes)
const express = require('express');

// Create a router instance (instead of using app directly)
const router = express.Router();

// Import User model (to update users in database)
const User = require('../models/User');

// Import Division model (used for validation/reference if needed)
const Division = require('../models/Division');

// Import OU model (Organisational Units)
const OU = require('../models/OU');

// Import authentication middleware (checks if user is logged in)
const auth = require('../middleware/authMiddleware');

// Import role middleware (checks if user has correct role)
const checkRole = require('../middleware/roleMiddleware');

// ======================================================
// 1. ASSIGN USER TO DIVISION (ADMIN ONLY)
// ======================================================
router.put('/assign-division', auth, checkRole(['admin']), async (req, res) => {
  try {
    // Extract userId and divisionId from request body
    const { userId, divisionId } = req.body;

    // Find the user by ID and update their divisions array
    const user = await User.findByIdAndUpdate(
      userId, // ID of user to update

      {
        // Add divisionId to user's divisions array
        // $addToSet ensures no duplicates are added
        $addToSet: { divisions: divisionId },
      },

      {
        new: true, // Return updated user instead of old one
      }
    );

    // Send updated user back as response
    res.json(user);
  } catch (err) {
    // If something goes wrong, return server error
    res.status(500).json({ message: 'Server error' });
  }
});

// ======================================================
// 2. ASSIGN USER TO OU (ADMIN ONLY)
// ======================================================
router.put('/assign-ou', auth, checkRole(['admin']), async (req, res) => {
  try {
    // Extract userId and ouId from request body
    const { userId, ouId } = req.body;

    // Find user and add OU to their ous array
    const user = await User.findByIdAndUpdate(
      userId, // ID of user

      {
        // Add OU ID without duplicates
        $addToSet: { ous: ouId },
      },

      {
        new: true, // Return updated user
      }
    );

    // Send updated user back
    res.json(user);
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: 'Server error' });
  }
});

// ======================================================
// 3. CHANGE USER ROLE (ADMIN ONLY)
// ======================================================
router.put('/change-role', auth, checkRole(['admin']), async (req, res) => {
  try {
    // Extract userId and new role from request body
    const { userId, role } = req.body;

    // Update user's role in database
    const user = await User.findByIdAndUpdate(
      userId, // ID of user

      {
        role: role, // Set new role (normal, management, admin)
      },

      {
        new: true, // Return updated user
      }
    );

    // Send updated user back
    res.json(user);
  } catch (err) {
    // Handle any errors
    res.status(500).json({ message: 'Server error' });
  }
});

// Export router so it can be used in server.js
module.exports = router;
