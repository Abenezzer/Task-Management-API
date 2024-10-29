const mongoose = require("mongoose");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  description: {
    type: String,
    minlength: 3,
    maxlength: 500,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "completed"],
  },
  dueDate: {
    type: Date,
  },
  priority: {
    type: String,
    default: "MEDIUM",
    enum: ["LOW", "MEDIUM", "HIGH"],
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 3000,
  },
  tasks: [taskSchema],
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
    } catch (err) {
      next(err);
      console.log(err);
    }
  }
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, config.get("jwt-secret-key"));
};

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  return Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  }).validate(user);
}

function validateTask(task) {
  return Joi.object({
    title: Joi.string().required().min(3).max(255),
    description: Joi.string().required().min(5).max(255),
    status: Joi.string().valid("pending", "completed").optional(),
    dueDate: Joi.date().optional(),
    priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
  });
}

module.exports = { User, validateUser, validateTask };
