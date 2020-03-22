const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if there are no token
  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied." });
    return;
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, config.get("JWT_SECRET"));
    req.user = decoded.user;
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid." });
  }
  next();
};
