const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: {
      validator: (value) => value.endsWith('@rpsu.edu.bd'),
      message: 'Only university emails (rpsu.edu.bd) are allowed.'
    }
  },
  password: { type: String, required: true, minlength: 6 },

  role: { type: String, enum: ['student', 'teacher'], required: true },
  profile_pic: { type: String, default: 'https://placehold.co/200x200?text=Profile' },
  banner_pic: { type: String, default: 'https://placehold.co/1200x300?text=Banner' },
  about_me: { type: String, default: '' },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },

  //Communities the user has joined
  communities_joined: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Community' }
  ],

  //Communities the user has created (they are admin of)
  communities_created: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Community' }
  ],

  /// Posts the user has liked or commented on (type: 'normal')
posts_interacted: [
  { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
],

// Events the user marked as interested (type: 'event')
events_interested: [
  { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
],

// Announcements bookmarked by the user (type: 'announcement')
announcements_bookmarked: [
  { type: mongoose.Schema.Types.ObjectId, ref: 'Announcement' }
],


}, { timestamps: true });

/**
 * Enforce limits:
 * - user can create at most 3 communities
 */
userSchema.pre('save', function(next) {
  if (this.communities_created && this.communities_created.length > 3) {
    return next(new Error('User cannot create more than 3 communities.'));
  }
  next();
});

/**
 * Automatically hash password before saving
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
