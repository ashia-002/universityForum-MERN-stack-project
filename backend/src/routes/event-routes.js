const express = require('express');
const router = express.Router();

const eventController = require('../controllers/event-controllers.js');
const { authentication } = require('../middlewares/authentication.js');

router.post('/create', authentication, eventController.createEvent);

//delete a post
router.delete('/delete/:id', authentication, eventController.deleteEvent);

//like/unlike
router.post('/:id/like', authentication, eventController.toggleVote);

//add comment(event)
router.post('/:id/comment', authentication, eventController.addComment);

//interested/uninterested
router.post('/:id/interested', authentication, eventController.toggleInterested);

//get single event
router.get('/:id/single-event', authentication, eventController.getEventById);

//get all event
router.get('/all-events', authentication, eventController.getAllEvents);

module.exports = router;