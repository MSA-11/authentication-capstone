/** @format */

// Import JWT (used to verify tokens)
const jwt = require('jsonwebtoken');

// Middleware function to protect routes
module.exports = function (req, res, next) {
  // Get token from request header
  const token = req.header('Authorization');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data (id + role) to request
    req.user = decoded;

    // Continue to next function (route)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
