const express = require("express");
const auth = require("../middlewares/auth");
const { User } = require("../model/User");
const { Task, validateTask } = require("../model/Task");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit; // Calculate the number of items to skip

  const tasks = user.tasks.slice(skip, skip + limit); // Paginate tasks array
  const totalTasks = user.tasks.length;
  req.send(tasks);
  res.send(user);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);
  const task = new Task(req.body);

  const user = await User.findById(req.userId);
  console.log(user);
  if (!user) throw new CustomError("User doesn't exist", 400);
  user.tasks.push(task);
  await user.save();
  res.status(201).send(task);
});

router.put("/:id", auth, async (req, res) => {
  const isValidId = mongoose.isValidObjectId(req.params.id);
  if (!isValidId) throw new CustomError("Invalid Task Id", 400);

  const { error } = validateTask(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);
  const user = await User.findOneAndUpdate(
    { _id: req.userId, "tasks._id": req.params.id }, // Find the user and the specific task
    { $set: { "tasks.$": req.body } }, // Update the task data
    { new: true } // Return the updated document
  );
  if (!user) throw new CustomError("User or Task not found", 400);
  res.send(user);
});

router.delete("/:id", auth, async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.userId },
    { $pull: { tasks: { _id: req.params.id } } }, // Remove the task with the matching _id
    { new: true } // Return the updated document
  );

  if (!user) throw new CustomError("User or Task not found", 400);
  res.send(user);
});
module.exports = router;
