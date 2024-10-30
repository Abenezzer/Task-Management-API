const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  mongoose
    .connect(config.get("db_string"))
    .then(() => {
      console.log("Connected to DB....");
    })
    .catch((err) => {
      logger.error(err.message, err);
      console.log("Something Went wrong: ", err);
      process.exit(1);
    });
};
