const Event = require('../models/posts/event');
const Community = require('../models/community');

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, scope, community_id, department_id, date, time, venue, image } = req.body;
    const created_by = req.user.id;

    // ✅ Check if event belongs to a community
    if (community_id) {
      const community = await Community.findById(community_id);
      if (!community) return res.status(404).json({ msg: 'Community not found' });

      // Check membership
      if (!community.members.includes(created_by)) {
        return res.status(403).json({ msg: 'You must join this community to create an event.' });
      }
    }

    const newEvent = await Event.create({
      title,
      description,
      scope,
      community_id: community_id || null,
      department_id: department_id || null,
      created_by,
      date,
      time,
      venue,
      image
    });

    res.status(201).json({
      msg: 'Event created successfully',
      event: newEvent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('created_by', 'name email')
      .populate('community_id', 'name')
      .populate('department_id', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get Single Event
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate('created_by', 'name email')
      .populate('comments.user', 'name email')
      .populate('community_id', 'name')
      .populate('department_id', 'name');

    if (!event) return res.status(404).json({ msg: 'Event not found' });

    res.status(200).json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (event.created_by.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.status(200).json({ msg: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Mark/Unmark Interested (RSVP)
exports.toggleInterested = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    const index = event.interested.indexOf(userId);
    if (index === -1) {
      event.interested.push(userId);
      await event.save();
      return res.status(200).json({ msg: 'Marked as interested' });
    } else {
      event.interested.splice(index, 1);
      await event.save();
      return res.status(200).json({ msg: 'Removed from interested list' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Upvote/Downvote
exports.toggleVote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (!event.votes) event.votes = [];

    const index = event.votes.indexOf(userId);
    if (index === -1) {
      event.votes.push(userId);
      await event.save();
      return res.status(200).json({ msg: 'Liked successfully' });
    } else {
      event.votes.splice(index, 1);
      await event.save();
      return res.status(200).json({ msg: 'Like removed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Add Comment
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) return res.status(400).json({ msg: 'Comment text required' });

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    event.comments.push({
      user: userId,
      text,
    });

    await event.save();
    res.status(200).json({ msg: 'Comment added', comments: event.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
