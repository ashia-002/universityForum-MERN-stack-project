// models/Event.js

const mongoose = require('mongoose');
const sharedFields = require('./sharedFields');

const eventSchema = new mongoose.Schema({
  ...sharedFields,

  interested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ]
});

module.exports = mongoose.model('Event', eventSchema);
