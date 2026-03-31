/** @format */

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const credentialRoutes = require('./routes/credentials');

// Import middleware
const auth = require('./middleware/authMiddleware');

// Import admin routes (for admin functionality)
const adminRoutes = require('./routes/admin');

require('dotenv').config();

// Create Express app
const app = express();

// Middleware (VERY IMPORTANT)
app.use(express.json()); // Allows JSON data
app.use(cors()); // Allows frontend to communicate with backend
app.use('/api/auth', authRoutes);
app.use('/api/credentials', require('./routes/credentials')); //use credential routes with base path /api/credentials
// Use admin routes with base path /api/admin
app.use('/api/admin', adminRoutes);

// Protected test route
app.get('/api/protected', auth, (req, res) => {
  res.json({
    message: 'Protected route accessed',
    user: req.user,
  });
});

// Basic test route (to check server works)
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Connect to MongoDB (we will add connection string next step)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
