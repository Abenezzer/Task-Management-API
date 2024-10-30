const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const logger = require("./utils/logger");
require("express-async-errors");

const users = require("./routes/users");
const tasks = require("./routes/tasks");
const error = require("./middlewares/error");

//setup
const app = express();
app.use(express.json());

// connect to db
mongoose
  .connect(config.get("db_string"))
  .then(() => {
    console.log("Connected to DB....");
  })
  .catch((err) => {
    console.log("Something Went wrong: ", err);
    process.exit(1);
  });

//routes
app.get("/", (req, res) => {
  res.send("Welecome to the app");
});

// setup routes
app.use("/api/users/", users);
app.use("/api/tasks/", tasks);
app.use(error);

process.on("uncaughtException", (err) => {
  logger.error(err.message, err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error(err.message, err);
  process.exit(1);
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server Listning at port ${PORT}...`));
