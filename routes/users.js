const express = require("express");
const Joi = require("joi");
const CustomeError = require("../utils/CustomeError");
const { User, validateUser } = require("../model/User");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { error } = validateUser(req.body);
    if (error) throw new CustomeError(error.details[0].message, 400);
    // check if the email is already exist if so return error
    const email = await User.findOne({ email: req.body.email });
    if (email) throw new CustomeError("User Already Registered", 400);
    // create a user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    const token = user.generateAuthToken();
    res.status(201).header("x-auth-token", token).send("Login Successful...");

  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return req.status(400).send("Invalid Email or Password");

  const match = user.comparePassword(req.body.password);
  if (!match) return req.status(400).send("Invalid Email or Password");

  const token = user.generateAuthToken();
  res.status(201).header("x-auth-token", token).send("Login Successful...");
});

function validateLoginUser(user) {
  return Joi.object({
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  }).validate(user);
}
module.exports = router;
