const Community = require('../models/community.js');
const User = require('../models/user.js');
const Post = require('../models/posts/post.js');
const Event = require('../models/posts/event.js');
const Announcement = require('../models/posts/announcement.js');


// CREATE COMMUNITY
exports.createCommunity = async (req, res) => {
  try {
    const { name, description, department_id, visibility, banner_image, icon_image } = req.body;
    const created_by = req.user.id;

    // Validate community count limit for this user
    const user = await User.findById(created_by);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (user.communities_created.length >= 3) {
      return res.status(400).json({ msg: 'You cannot create more than 3 communities.' });
    }

    // Create the community
    const community = await Community.create({
      community_id: `comm-${Date.now()}`,
      name,
      description,
      created_by,
      department_id: department_id || null,
      visibility: visibility || 'public',
      banner_image: banner_image || 'https://placehold.co/1200x300?text=Community+Banner',
      icon_image: icon_image || 'https://placehold.co/100x100?text=Icon',
      members: [created_by]
    });

    // Add to user's created communities
    user.communities_created.push(community._id);
    await user.save();

    res.status(201).json({
      msg: 'Community created successfully',
      community
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// EDIT COMMUNITY (Admin only)
exports.editCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, guidelines, visibility, banner_image, icon_image } = req.body;
    const userId = req.user.id;

    const community = await Community.findById(id);
    if (!community) return res.status(404).json({ msg: 'Community not found' });

    // Only the creator (admin) can edit
    if (community.created_by.toString() !== userId) {
      return res.status(403).json({ msg: 'You are not authorized to edit this community.' });
    }

    // Update fields
    if (name) community.name = name;
    if (description) community.description = description;
    if (guidelines) community.guidelines = guidelines;
    if (visibility) community.visibility = visibility;
    if (banner_image) community.banner_image = banner_image;
    if (icon_image) community.icon_image = icon_image;

    await community.save();

    res.status(200).json({
      msg: 'Community updated successfully',
      community
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// DELETE COMMUNITY (Admin only)
exports.deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const community = await Community.findById(id);
    if (!community) return res.status(404).json({ msg: 'Community not found' });

    if (community.created_by.toString() !== userId) {
      return res.status(403).json({ msg: 'Only the community admin can delete' });
    }

    await community.deleteOne();
    res.status(200).json({ msg: 'Community deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

//all posts
exports.getCommunityPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ community_id: id })
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

//all events in community
exports.getCommunityEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const events = await Event.find({ community_id: id })
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// all announcement in community
exports.getCommunityAnnouncements = async (req, res) => {
  try {
    const { id } = req.params;
    const announcements = await Announcement.find({ community_id: id })
      .populate('created_by', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ announcements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// view community(by id)
exports.getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id)
      .populate('created_by', 'name email')
      .select('name banner_image icon_image description member_count createdAt created_by');

    if (!community) {
      return res.status(404).json({ msg: 'Community not found' });
    }

    res.status(200).json({ community });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const { id } = req.params; // community id
    const userId = req.user.id;

    const community = await Community.findById(id);
    if (!community) return res.status(404).json({ msg: 'Community not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Check if already joined
    if (community.members.includes(userId)) {
      return res.status(400).json({ msg: 'You are already a member of this community' });
    }

    // Add user to community members
    community.members.push(userId);
    await community.save();

    // Add community to user's joined list
    user.communities_joined.push(community._id);
    await user.save();

    res.status(200).json({
      msg: 'Joined community successfully',
      community_id: community._id,
      community_name: community.name
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// LEAVE COMMUNITY
exports.leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params; // community id
    const userId = req.user.id;

    const community = await Community.findById(id);
    if (!community) return res.status(404).json({ msg: 'Community not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // If user is the creator, prevent leaving
    if (community.created_by.toString() === userId) {
      return res.status(400).json({ msg: 'Community creators cannot leave their own community' });
    }

    // Remove user from community
    community.members = community.members.filter(
      memberId => memberId.toString() !== userId
    );
    await community.save();

    // Remove community from user's joined list
    user.communities_joined = user.communities_joined.filter(
      commId => commId.toString() !== id
    );
    await user.save();

    res.status(200).json({
      msg: 'Left community successfully',
      community_id: community._id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};