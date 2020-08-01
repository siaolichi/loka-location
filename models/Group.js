const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
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
    name: {
        type: String,
        required: true,
    },
    public: {
        type: Boolean,
        required: true,
    },
    locations: [
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
