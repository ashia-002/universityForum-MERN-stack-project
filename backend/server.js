const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const connectDb = require('../backend/src/config/db.js');
const seed = require('./src/config/seedDepartments.js');

const authRoutes = require('../backend/src/routes/auth-routes.js');
const deptRoutes = require('../backend/src/routes/dept-routes.js');
const postRoutes = require('../backend/src/routes/post-routes.js');
const eventRoutes = require('../backend/src/routes/event-routes.js');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/', (req, res) => {
  res.send("Backend is running smoothly!!");
});

// Routes
app.use('/auth', authRoutes);
app.use('/get/department', deptRoutes);
app.use('/post', postRoutes);
app.use('/event', eventRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
  });
});

// Connect DB and start server

connectDb()
  .then(() => {
    console.log("MongoDB is connected");
    app.listen(PORT, () => {
      console.log(`Server is running on: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
