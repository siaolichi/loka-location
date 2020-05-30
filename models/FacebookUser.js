const mongoose = require('mongoose');
const FacebookUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  facebook_id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('facebook_user', FacebookUserSchema);
