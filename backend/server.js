const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const connectDb = require('../backend/src/config/db.js');
const seed = require('./src/config/seedDepartments.js');

const authRoutes = require('../backend/src/routes/auth-routes.js');
const deptRoutes = require('../backend/src/routes/dept-routes.js');
const postRoutes = require('../backend/src/routes/post-routes.js');
const eventRoutes = require('../backend/src/routes/event-routes.js');
const announcementRoutes = require('../backend/src/routes/announcement-routes.js');
const communityRoutes = require('../backend/src/routes/community-routes.js');
const ProfileRoutes = require('../backend/src/routes/profile-routes.js');

const app = express();
const PORT = process.env.PORT || 4000;

//cross platform manage
// app.use(
//     cors({
//         origin: ["rpsuforum.vercel.app", "http://localhost:5173/"],
//         methods: ["GET", "POST", "DELETE", "PUT"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//         credentials: true
//     })
// );
// CORS configuration - allowing multiple origins
const allowedOrigins = [
    "https://university-forum-mern-stack-project-ivory.vercel.app",   // ✅ Production
    "http://localhost:5173"           // ✅ Local dev
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Reject the request
        }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies and headers
}));

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
app.use('/announcement', announcementRoutes);
app.use('/community', communityRoutes);
app.use('/profile', ProfileRoutes);

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
