const mongoose = require('mongoose');
require('dotenv').config();

const Department = require('../models/department.js')
// const connectDb = require('../config/db.js');

const departments = [
  { department_id: 'CSE101', name: 'Computer Science and Engineering' },
  { department_id: 'EEE202', name: 'Electrical and Electronic Engineering' },
  { department_id: 'BBA303', name: 'Business Administration' },
  { department_id: 'ENG404', name: 'English' },
];

const seed = async () => {
  try {
    // await connectDb(); // ✅ wait for DB connection
    await mongoose.connect(process.env.MONGO_URL);
    await Department.deleteMany(); // ✅ clean up existing departments
    await Department.insertMany(departments); // ✅ insert new ones

    console.log('Departments seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding departments:', err.message);
    process.exit(1);
  }
};

module.exports = seed;
