const Announcement = require('../models/posts/announcement');
const User = require('../models/user');
const Community = require('../models/community');

// Create Announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, scope, community_id, department_id, priority_level } = req.body;
    const created_by = req.user.id;

    const announcement = await Announcement.create({
      title,
      description,
      scope, // 'community' | 'department' | 'university'
      community_id: community_id || null,
      department_id: department_id || null,
      priority_level: priority_level || 'default',
      created_by
    });

    //If part of a community, push to that community
    if (community_id) {
      await Community.findByIdAndUpdate(community_id, {
        $push: { announcements: announcement._id }
      });
    }

    res.status(201).json({
      msg: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};


// Delete an announcement (admin or creator only)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const announcement = await Announcement.findById(id);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    if (announcement.created_by.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this announcement' });
    }

    await announcement.deleteOne();
    res.status(200).json({ msg: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// like/unlike
exports.toggleVote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const announcement = await Announcement.findById(id);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    if (!announcement.votes) announcement.votes = [];

    const index = announcement.votes.indexOf(userId);
    if (index === -1) {
      announcement.votes.push(userId);
      await announcement.save();
      return res.status(200).json({ msg: 'Like added' });
    } else {
      announcement.votes.splice(index, 1);
      await announcement.save();
      return res.status(200).json({ msg: 'Like removed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

//bookmark/unbookmark
exports.toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const announcement = await Announcement.findById(id);
    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    const user = await User.findById(userId);

    const index = user.announcements_bookmarked.indexOf(id);
    if (index === -1) {
      user.announcements_bookmarked.push(id);
      await user.save();
      return res.status(200).json({ msg: 'Announcement bookmarked' });
    } else {
      user.announcements_bookmarked.splice(index, 1);
      await user.save();
      return res.status(200).json({ msg: 'Bookmark removed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

//all-anouncemment
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

//single-announcement
exports.getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id)
      .populate('created_by', 'name email')
      .populate('community_id', 'name');

    if (!announcement) return res.status(404).json({ msg: 'Announcement not found' });

    res.status(200).json({ announcement });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
