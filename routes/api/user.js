const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypet = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");

//@routes       GET api/user
//@desc         Test route
//@access       public
router.get("/", (req, res) => {
  res.send("user route.");
});

//@routes       POST api/user
//@desc         Register user
//@access       public
router.post(
  "/",
  [
    check("name", "Name is required.")
      .not()
      .isEmpty(),
    check("email", "Plesase enter a valid E-mail").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters."
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: "User already exists." }] });
      }

      //Get user gravatar
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
      user = new User({
        name,
        email,
        avatar,
        password
      });

      //Encrypt password
      const salt = await bcrypet.genSalt(10);
      user.password = await bcrypet.hash(password, salt);
      await user.save();

      //Return json webtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error.");
    }
  }
);

module.exports = router;
