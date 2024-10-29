const express = require("express");
const { User, validateUser } = require("../model/User");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // check if the email is already exist if so return error
    const email = await User.findOne({ email: req.body.email });
    if (email) return res.status(400).send("User Alrady Registered...");
    // create a user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    const token = user.generateAuthToken();
    res.status(201).header('x-auth-token', token).send('Login Successful...');

    // log the user
  } catch (err) {}
});

module.exports = router;
