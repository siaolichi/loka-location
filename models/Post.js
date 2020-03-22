const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user"
  },
  title: {
    type: String
  },
  text: {
    type: String,
    required: true
  },
  locations: [
    {
      address: {
        type: String
      },
      photo: {
        type: String
      },
      description: {
        type: String
      },
      category: {
        type: String
      }
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("post", PostSchema);
