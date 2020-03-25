const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const Group = require("../../models/Group");
const User = require("../../models/User");

//@routes       GET api/group
//@desc         Get all public group
//@access       public
router.get("/", async (req, res) => {
  try {
    const posts = await Group.find()
      .populate("user", ["name", "avatar"])
      .sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(404).send("Server Error");
  }
});

//@routes       GET api/group/:id
//@desc         Get public group by id
//@access       public
router.get("/:id", async (req, res) => {
  try {
    const post = await Group.findById(req.params.id).populate("user", [
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

//@routes       POST api/group
//@desc         Create a group
//@access       private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Text is required")
        .not()
        .isEmpty(),
      check("public", "Choose public or private")
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
      const newGroup = new Group({
        user: user.id,
        avatar: user.avatar,
        name: req.body.name,
        public: req.body.public
      });
      const group = await newGroup.save();
      res.json(group);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

//@routes       DELETE api/group/:id
//@desc         Get group by ID
//@access       private
router.delete("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate("user", [
      "name",
      "avatar"
    ]);
    //Check if group exist
    if (!group) return res.status(404).json({ msg: "group not found" });

    //Check user
    if (group.user.id !== req.user.id) {
      console.log(group.user.id, " ? ", req.user.id);
      return res.status(404).json({ msg: "User notauthorized" });
    }
    //Remove group
    await group.remove();

    res.json({ group, msg: "Group is removed" });
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "group not found" });
    console.log(err);
    res.status(500).send("Server Error");
  }
});

//@routes       POST api/group/location
//@desc         Create a location for a group
//@access       private
router.post(
  "/location/:id",
  [
    auth,
    [
      check("name", "Name is required")
        .not()
        .isEmpty(),
      check("address", "Address is required")
        .not()
        .isEmpty(),
      check("latLng", "Address is required")
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
      const group = await Group.findById(req.params.id);
      const newLocation = {
        user: user.id,
        avatar: user.avatar,
        name: req.body.name,
        address: req.body.address,
        photo: req.body.photo,
        latLng: req.body.latLng,
        description: req.body.description
      };

      group.locations.unshift(newLocation);

      const location = await group.save();
      res.json(location);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  }
);

//@routes       POST api/group/location
//@desc         Edit location details
//@access       private
router.post("/location/:id/:location_id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    const location = group.locations.find(
      location => location.id == req.params.location_id
    );
    if (!location) return res.status(404).json({ msg: "Location not found" });

    const newLocation = {
      user: location.user,
      avatar: location.avatar,
      name: location.name,
      address: location.address,
      photo: location.photo,
      latLng: location.latLng,
      description: req.body.description
    };
    //Check user
    // if (
    //   req.user.id !== location.user.toString() ||
    //   req.user.id !== group.user.toString()
    // ) {
    //   return res.status(401).json({ msg: "User not authorized" });
    // }

    //Get remove index
    const editIndex = group.locations
      .map(location => location.id.toString())
      .indexOf(req.params.location_id);
    group.locations[editIndex] = newLocation;
    console.log(newLocation);
    await group.save();
    res.json(group.locations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//@routes       DELETE api/group/location
//@desc         Delete a location from a post
//@access       private
router.delete("/location/:id/:location_id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    const location = group.locations.find(
      location => location.id == req.params.location_id
    );
    console.log(location);
    if (!location) return res.status(404).json({ msg: "Location not found" });

    //Check user
    if (
      req.user.id !== location.user.toString() ||
      req.user.id !== group.user.toString()
    ) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    //Get remove index
    const removeIndex = group.locations
      .map(location => location.id.toString())
      .indexOf(req.params.location_id);
    group.locations.splice(removeIndex, 1);
    await group.save();
    res.json(group.locations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
