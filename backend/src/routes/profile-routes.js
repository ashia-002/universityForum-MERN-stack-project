const express = require('express');
const router = express.Router();
const { authentication } = require('../middlewares/authentication');
const profileController = require('../controllers/profile-controllers.js');

// Edit profile
router.put('/edit', authentication, profileController.editProfile);

router.get('/view-profile', authentication, profileController.getOwnProfile);

// Get user’s bookmarks & interested
router.get('/bookmarks', authentication, profileController.getUserBookmarks);

// Get user’s created content
router.get('/activity', authentication, profileController.getUserActivity);

// Delete profile
router.delete('/delete', authentication, profileController.deleteProfile);

module.exports = router;
