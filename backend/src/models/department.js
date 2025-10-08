const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  department_id: { type: String, required: true, unique: true }, // e.g., "CSE101"
  name: { type: String, required: true, unique: true }, // e.g., "Computer Science and Engineering"

  // Optional: Track users in this department
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);
