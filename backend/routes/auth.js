/** @format */

// ==========================
// IMPORT REQUIRED MODULES
// ==========================

const express = require('express'); // Express for routes
const router = express.Router(); // Router instance

const bcrypt = require('bcryptjs'); // Password hashing
const jwt = require('jsonwebtoken'); // Token generation

const User = require('../models/User'); // User model

// ==========================
// REGISTER USER
// ==========================

router.post('/register', async (req, res) => {
  try {
    // Get input data
    const { username, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      username: username,
      password: password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save to DB
    await user.save();

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // SEND FULL USER (INCLUDING divisions)
    res.json({
      token,
      user, // SEND FULL USER OBJECT BACK TO FRONTEND (INCLUDES DIVISIONS)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ==========================
// LOGIN USER
// ==========================

router.post('/login', async (req, res) => {
  try {
    // Get input
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    //  SEND FULL USER OBJECT
    res.json({
      token,
      user, // SEND FULL USER OBJECT BACK TO FRONTEND
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Export router
module.exports = router;
