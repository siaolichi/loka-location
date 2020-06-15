const mongoose = require('mongoose');
const GoogleUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  google_id: {
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

module.exports = mongoose.model('google_user', GoogleUserSchema);
