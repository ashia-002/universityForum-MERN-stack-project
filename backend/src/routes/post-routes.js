const express = require('express');
const router = express.Router();

const postController = require('../controllers/post-controllers.js');
const { authentication } = require('../middlewares/authentication.js');

//Create a new post
router.post('/create', authentication, postController.createPost);

//Delete a post (only creator or admin)
router.delete('/:id/delete', authentication, postController.deletePost);

//Like / Unlike post
router.post('/:id/like', authentication, postController.toggleLike);

//Add comment (only if post allows comments)
router.post('/:id/comment', authentication, postController.addComment);

//Bookmark / Unbookmark post
router.post('/:id/bookmark', authentication, postController.toggleBookmark);

//Get all posts
router.get('/all-posts', authentication, async (req, res) => {
  try {
    const posts = await require('../models/posts/post').find().populate('created_by', 'name role');
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching posts', error: err.message });
  }
});

//Get single post
router.get('/single-post/:id', authentication, async (req, res) => {
  try {
    const post = await require('../models/posts/post').findById(req.params.id)
      .populate('created_by', 'name role')
      .populate('community_id', 'name')
      .populate('department_id', 'name');

    if (!post) return res.status(404).json({ msg: 'Post not found' });
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching post', error: err.message });
  }
});

module.exports = router;
