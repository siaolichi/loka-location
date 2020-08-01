const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        refPath: 'provider',
    },
    provider: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'facebook_user', 'google_user'],
    },
    title: {
        type: String,
    },
    text: {
        type: String,
        required: true,
    },
    locations: [
        {
            address: {
                type: String,
            },
            photo: {
                type: String,
            },
            description: {
                type: String,
            },
            category: {
                type: String,
            },
        },
    ],
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                refPath: 'provider',
            },
            provider: {
                type: String,
                required: true,
                default: 'user',
                enum: ['user', 'facebook_user', 'google_user'],
            },
        },
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                refPath: 'provider',
            },
            provider: {
                type: String,
                required: true,
                default: 'user',
                enum: ['user', 'facebook_user', 'google_user'],
            },
            text: {
                type: String,
                required: true,
            },
            name: {
                type: String,
            },
            date: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('post', PostSchema);
