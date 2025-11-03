const express = require('express');
const router = express.Router();
const { authentication } = require('../middlewares/authentication');
const communityController = require('../controllers/community-controllers');


router.post('/create', authentication, communityController.createCommunity);
router.put('/edit/:id', authentication, communityController.editCommunity);
router.delete('/delete/:id', authentication, communityController.deleteCommunity);

// View & Fetch
router.get('/view-all', communityController.getAllCommunities)
router.get('/view/:id', communityController.getCommunityById); 
router.get('/:id/posts', communityController.getCommunityPosts);
router.get('/:id/events', communityController.getCommunityEvents);
router.get('/:id/announcements', communityController.getCommunityAnnouncements);

router.post('/:id/join', authentication, communityController.joinCommunity);
router.post('/:id/leave', authentication, communityController.leaveCommunity);

module.exports = router;
