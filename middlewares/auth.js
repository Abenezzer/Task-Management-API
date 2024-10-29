const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return req.status(400).send("Token is not set");
  const payload = jwt.verify(token, config.get("jwt-secret-key"));
  if (!payload) return res.status(401).send("Invalid Token");
  req.userId = payload.id;
  next();
};
