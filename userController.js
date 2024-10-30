const Joi = require("joi");
const CustomError = require("../utils/CustomError");
const { User, validateUser } = require("../model/User");

const registerUser = async (req, res, next) => {
  const { error } = validateUser(req.body);
  if (error) res.status(400).send(error.details[0].message);
  // check if the email is already exist if so return error
  const email = await User.findOne({ email: req.body.email });
  if (email) throw new CustomError("User Already Registered", 400);
  // create a user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  await user.save();
  const token = user.generateAuthToken();
  res.status(201).header("x-auth-token", token).send("Login Successful...");
};

const loginUser = async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);
  const user = await User.findOne({ email: req.body.email });
  if (!user) throw new CustomError("Invalid Email or Password", 400);

  const match = user.comparePassword(req.body.password);
  if (!match) throw new CustomError("Invalid Email or Password", 400);

  const token = user.generateAuthToken();
  res.status(201).header("x-auth-token", token).send("Login Successful...");
};

function validateLoginUser(user) {
  return Joi.object({
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  }).validate(user);
}
