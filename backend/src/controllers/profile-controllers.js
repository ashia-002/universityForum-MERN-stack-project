const Community = require('../models/community.js');
const User = require('../models/user.js');
const Post = require('../models/posts/post.js');
const Event = require('../models/posts/event.js');
const Announcement = require('../models/posts/announcement.js');

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, about_me, profile_pic, banner_pic } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (name) user.name = name;
    if (about_me) user.about_me = about_me;
    if (profile_pic) user.profile_pic = profile_pic;
    if (banner_pic) user.banner_pic = banner_pic;


    await user.save();

    res.status(200).json({
      msg: 'Profile updated successfully',
      user
    });
  } catch (err) {
    console.error('Error editing profile:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getOwnProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('name email about_me profile_pic banner_pic createdAt role');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        about_me: user.about_me,
        role: user.role,
        created_at: user.createdAt,
        profile_pic: user.profile_pic,
        banner_pic: user.banner_pic,
      },
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// GET ALL BOOKMARKED / INTERESTED ITEMS
exports.getUserBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate('posts_interacted')
      .populate('events_interested')
      .populate('announcements_bookmarked');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.status(200).json({
      posts_interacted: user.posts_interacted,
      events_interested: user.events_interested,
      announcements_bookmarked: user.announcements_bookmarked
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// GET ALL POSTS / EVENTS / ANNOUNCEMENTS CREATED BY USER
exports.getUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    const [posts, events, announcements] = await Promise.all([
      Post.find({ created_by: userId }).sort({ createdAt: -1 }),
      Event.find({ created_by: userId }).sort({ createdAt: -1 }),
      Announcement.find({ created_by: userId }).sort({ createdAt: -1 })
    ]);

    res.status(200).json({
      posts,
      events,
      announcements
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Delete sensitive fields
    user.name = 'Deleted User';
    user.email = `deleted_${Date.now()}@rpsu.edu.bd`;
    user.password = 'deleted';
    user.profile_pic = 'https://placehold.co/200x200?text=Deleted';
    user.banner_pic = 'https://placehold.co/1200x300?text=Deleted';
    user.about_me = '';
    user.communities_joined = [];
    user.communities_created = [];
    await user.save();

    res.clearCookie('token'); // if using cookies for JWT
    res.status(200).json({ msg: 'Profile deleted successfully (content preserved)' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
