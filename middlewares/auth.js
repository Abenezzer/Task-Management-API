const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const config = require("config");

module.exports = function (req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(400).send("Token is not set.");
    const payload = jwt.verify(token, config.get("jwt-secret-key"));
    req.userId = payload.id;
    next();
  } catch (err) {
    res.status(401).send("invalid token");
  }
};
