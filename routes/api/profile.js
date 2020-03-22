const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile");
const User = require("../../models/User");

const auth = require("../../middleware/auth");
//@routes       GET api/profiles/me
//@desc         Get user's profile
//@access       private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "email", "avatar"]);
    if (!profile)
      return res.status(400).json({ msg: "No profile for this user" });
    return res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/profile
// @desc     Create/Update user profile
// @access   private

router.post("/", auth, async (req, res) => {
  const {
    bio,
    memo,
    website,
    location,
    facebook,
    twitter,
    instagram,
    groups
  } = req.body;
  const profileFields = {};
  profileFields.user = req.user.id;
  if (website) profileFields.website = website;
  if (bio) profileFields.bio = bio;
  if (location) profileFields.location = location;
  if (memo) profileFields.memo = memo;
  if (groups) profileFields.groups = groups;
  profileFields.social = {};
  if (facebook) profileFields.social.facebook = facebook;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    // Update if profile already exist
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    //Create if profile not found
    profile = new Profile(profileFields);
    await profile.save();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }

  res.json(profileFields);
});

// @routes       GET api/profiles
// @desc         Get all user's profile
// @access       public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error.");
  }
});

// @routes       GET api/profile/user/:user_id
// @desc         Get profile by user ID
// @access       public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profiles = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profiles)
      return res.status(400).json({ msg: "No profile for this user" });

    res.json(profiles);
  } catch (err) {
    console.error(err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "No profile for this user" });
    }
    res.status(500).send("Server Error.");
  }
});

// @routes       DELETE api/profiles
// @desc         Remove user ID
// @access       private
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User is removed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error.");
  }
});

module.exports = router;
