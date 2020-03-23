const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");

//@routes       GET api/post
//@desc         Test route
//@access       public
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", ["name", "avatar"])
      .sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(404).send("Server Error");
  }
});

//@routes       GET api/post/:id
//@desc         Get post by ID
//@access       public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", [
      "name",
      "avatar"
    ]);
    if (!post) return res.status(404).json({ msg: "post not found" });
    res.json(post);
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "post not found" });
    console.error(err);
    res.status(404).send("Server Error");
  }
});

//@routes       POST api/post
//@desc         Create a post
//@access       private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty(),
      check("title", "Title is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const newPost = new Post({
        user: user.id,
        name: user.name,
        title: req.body.title,
        text: req.body.text
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

//@routes       DELETE api/post/:id
//@desc         Get post by ID
//@access       private
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", [
      "name",
      "avatar"
    ]);
    //Check if post exist
    if (!post) return res.status(404).json({ msg: "post not found" });

    //Check user
    if (post.user.id !== req.user.id) {
      console.log(post.user.id, " ? ", req.user.id);
      return res.status(404).json({ msg: "User notauthorized" });
    }
    //Remove post
    await post.remove();

    res.json({ post, msg: "Post is removed" });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "post not found" });
    console.log(err);
    res.status(500).send("Server Error");
  }
});

//@routes       PUT api/post/like/:id
//@desc         Like a post
//@access       private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked." });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error.");
  }
});

//@routes       PUT api/post/unlike/:id
//@desc         Unlike a post
//@access       private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length < 1
    ) {
      return res.status(400).json({ msg: "Post not been liked." });
    }

    //Unlike by index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error.");
  }
});

//@routes       POST api/post/comment
//@desc         Create a comment for a post
//@access       private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      const newComment = {
        user: user.id,
        name: user.name,
        avatar: user.avatar,
        text: req.body.text
      };

      post.comments.unshift(newComment);

      const comment = await post.save();
      res.json(comment);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

//@routes       DELETE api/post/comment
//@desc         Delete a comment from a post
//@access       private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const comment = post.comments.find(
      comment => comment.id == req.params.comment_id
    );
    console.log(comment);
    if (!comment) return res.status(404).json({ msg: "Comment not found" });

    //Check user
    if (req.user.id !== comment.user.toString()) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //Get remove index
    const removeIndex = post.comments
      .map(comment => comment.id.toString())
      .indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
