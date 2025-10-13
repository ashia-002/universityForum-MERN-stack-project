// models/Announcement.js

const mongoose = require('mongoose');
const sharedFields = require('./sharedFields');

const announcementSchema = new mongoose.Schema({
  ...sharedFields,

  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Announcement', announcementSchema);
