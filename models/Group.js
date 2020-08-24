const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'provider',
    },
    provider: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'facebook_user', 'google_user'],
    },
    name: {
        type: String,
        required: true,
    },
    public: {
        type: Boolean,
        required: true,
    },
    city: {
        type: String,
    },
    introduction: {
        type: String,
    },
    locations: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'provider',
            },
            provider: {
                type: String,
                required: true,
                default: 'user',
                enum: ['user', 'facebook_user', 'google_user'],
            },
            name: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            url: {
                type: String,
            },
            latLng: {
                type: Object,
                required: true,
            },
            photo: {
                type: String,
            },
            description: {
                type: String,
            },
            placeId: {
                type: String,
            },
        },
    ],
});

module.exports = mongoose.model('group', GroupSchema);
