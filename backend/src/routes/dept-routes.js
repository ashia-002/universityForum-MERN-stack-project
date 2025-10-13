const express = require('express');
const router = express.Router();

const Department = require('../models/department')
router.get('/', async (req, res) => {
  console.log("Received GET /get/department request");
  try {
    const departments = await Department.find({}, '_id department_id name');
    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error.message);
    res.status(500).json({ message: 'Error fetching departments', error: error.message });
  }
});

module.exports = router;