const express = require('express')
const router = express.Router();

const announcementController = require('../controllers/announcement-controllers');
const { authentication } = require('../middlewares/authentication');


router.post('/create', authentication, announcementController.createAnnouncement);

router.delete('/delete/:id', authentication, announcementController.deleteAnnouncement);

router.post('/:id/like', authentication, announcementController.toggleVote);

router.post('/:id/bookmark', authentication, announcementController.toggleBookmark);

router.get('/:id/single-announcement', authentication, announcementController.getAnnouncementById);

router.get('/all-announcements', authentication, announcementController.getAllAnnouncements);

module.exports = router;