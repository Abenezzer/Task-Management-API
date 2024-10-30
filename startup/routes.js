const users = require("../routes/users");
const tasks = require("../routes/tasks");
const error = require("../middlewares/error");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users/", users);
  app.use("/api/tasks/", tasks);
  app.use(error);
};
