const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  website: {
    type: String
  },
  bio: {
    type: String
  },
  memo: {
    type: String
  },
  location: {
    type: String
  },
  groups: {
    type: Array
  },
  social: {
    facebook: {
      type: String
    },
    twitter: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("profile", ProfileSchema);
