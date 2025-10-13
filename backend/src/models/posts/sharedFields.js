const mongoose = require('mongoose')


const sharedFields = {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String},
    scope: {
        type: String,
        enum: ['community', 'department', 'university'],
        required: true,
    },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    community_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Community', default: null},
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
};

module.exports = sharedFields;