const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  community_id: { type: String, required: true, unique: true },

  name: { 
    type: String, 
    required: true, 
    trim: true, 
    minlength: 3, 
    maxlength: 100 
  },

  description: { 
    type: String, 
    required: true, 
    maxlength: 500 
  },

  guidelines: { 
    type: String, 
    maxlength: 500 
  },

  // 
  banner_image: { 
    type: String, 
    default: 'https://placehold.co/1200x300?text=Community+Banner'
  },

  //
  icon_image: { 
    type: String, 
    default: 'https://placehold.co/100x100?text=Icon'
  },

  // Creator (acts as admin)
  created_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // Members
  members: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],

  // Posts under this community
  posts: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
  ],

  // Events created inside this community
  events: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
  ],

  // Announcements made within this community
  announcements: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Announcement' }
  ],

  // Optional department association
  department_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    default: null 
  },

  // Visibility (public = anyone can join, private = invite/approval)
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },

  // Stats
  member_count: { type: Number, default: 1 },
  post_count: { type: Number, default: 0 },
  event_count: { type: Number, default: 0 },
  announcement_count: { type: Number, default: 0 }

}, { timestamps: true });

// Auto-update stats
communitySchema.pre('save', function(next) {
  this.member_count = this.members.length || 1;
  this.post_count = this.posts.length || 0;
  this.event_count = this.events.length || 0;
  this.announcement_count = this.announcements.length || 0;
  next();
});

module.exports = mongoose.model('Community', communitySchema);
