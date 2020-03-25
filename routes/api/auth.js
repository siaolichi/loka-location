const express = require("express");
const router = express.Router();
const bcrypet = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

//@routes       GET api/auth
//@desc         Test route
//@access       public
router.get("/", auth, async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user.id).select("-password");
    console.log(user);
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

//@routes       POST api/auth
//@desc         Login user
//@access       public
router.post(
  "/",
  [
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

    const { email, password } = req.body;
    try {
      //See if user exists
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //Match E-mail and password
      const isMatched = await bcrypet.compare(password, user.password);
      if (!isMatched) {
        res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //Return json webtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600000 },
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
