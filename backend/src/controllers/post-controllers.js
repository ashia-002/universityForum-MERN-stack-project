const Post = require('../models/posts/post');
const User = require('../models/user');
const Community = require('../models/community');

//Create Post
exports.createPost = async (req, res) => {
  try {
    const { title, description, scope, community_id, department_id, image } = req.body;
    const created_by = req.user.id;

    console.log('Request body:', req.body);

    // ✅ Check if posting under a community
    if (community_id) {
      const community = await Community.findById(community_id);
      if (!community) return res.status(404).json({ msg: 'Community not found' });

      // Check membership
      if (!community.members.includes(created_by)) {
        return res.status(403).json({ msg: 'You must join this community to create a post.' });
      }
    }

    const newPost = await Post.create({
      title,
      description,
      scope,
      community_id: community_id || null,
      department_id: department_id || null,
      created_by,
      image
    });

    res.status(201).json({
      msg: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Server side error',
      error: error.message
    });
  }
};

exports.deletePost = async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        if (post.created_by.toString() !== userId && userRole !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
    res.status(200).json({ msg: 'Post deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Server side error!',
            error: error.message
        });
    }
}

// like/unlike
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const index = post.likes.indexOf(userId);
    if (index === -1) {
      post.likes.push(userId);
      await post.save();
      return res.status(200).json({ msg: 'Post liked' });
    } else {
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({ msg: 'Like removed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


//ADD COMMENT

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) return res.status(400).json({ msg: 'Comment text required' });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    post.comments.push({
      user: userId,
      text,
    });

    await post.save();
    res.status(200).json({ msg: 'Comment added', comments: post.comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Bookmark/Unbookmark
exports.toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const index = post.bookmarks.indexOf(userId);
    if (index === -1) {
      post.bookmarks.push(userId);
      await post.save();
      return res.status(200).json({ msg: 'Post bookmarked' });
    } else {
      post.bookmarks.splice(index, 1);
      await post.save();
      return res.status(200).json({ msg: 'Bookmark removed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

