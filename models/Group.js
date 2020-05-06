const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  public: {
    type: Boolean,
    required: true
  },
  locations: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
      },
      name: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      url: {
        type: String
      },
      latLng: {
        type: Object,
        required: true
      },
      photo: {
        type: String
      },
      description: {
        type: String
      }
    }
  ]
});

module.exports = mongoose.model('group', GroupSchema);
