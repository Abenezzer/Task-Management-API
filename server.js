const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const app = express();

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

app.get("/", (req, res) => {
  res.send("Welecome to the app");
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => console.log(`Server Listning at port ${PORT}...`));
