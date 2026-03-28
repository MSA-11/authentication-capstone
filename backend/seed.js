/** @format */

// Import required modules
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const OU = require('./models/OU');
const Division = require('./models/Division');

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => console.log(err));

// Seed function
const seedData = async () => {
  try {
    // Clear existing data (clean start)
    await OU.deleteMany();
    await Division.deleteMany();

    // Create OUs (EXACT names from PDF)
    const news = await OU.create({ name: 'News management' });
    const software = await OU.create({ name: 'Software reviews' });
    const hardware = await OU.create({ name: 'Hardware reviews' });
    const opinion = await OU.create({ name: 'Opinion publishing' });

    // Create divisions (example data)
    await Division.create([
      { name: 'Finance', ou: news._id },
      { name: 'IT', ou: news._id },
      { name: 'Development', ou: software._id },
      { name: 'Testing', ou: hardware._id },
      { name: 'Writing', ou: opinion._id },
    ]);

    console.log('Sample data inserted successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Run seed function
seedData();
