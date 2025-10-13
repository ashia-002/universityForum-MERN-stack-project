// models/Post.js

const mongoose = require('mongoose');
const sharedFields = require('./sharedFields');

const postSchema = new mongoose.Schema({
  ...sharedFields,

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ],

  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Post', postSchema);
