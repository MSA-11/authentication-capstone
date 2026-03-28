/** @format */

// Middleware to check user role
module.exports = function (roles) {
  return (req, res, next) => {
    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // If allowed → continue
    next();
  };
};
