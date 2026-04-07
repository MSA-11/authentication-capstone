/** @format */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  FETCH FULL USER FROM DB (THIS FIXES EVERYTHING)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach full user
    req.user = user;

    console.log('USER DIVISIONS:', user.divisions); // DEBUG

    next();
  } catch (error) {
    console.log('AUTH ERROR:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
