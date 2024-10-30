const { User } = require("../model/User");
const { Task, validateTask } = require("../model/Task");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");

const getAllTasks = async (req, res) => {
  const userId = req.userId; // Assuming user ID is in the request (e.g., from auth middleware)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Retrieve user with paginated tasks
  const user = await User.findById(userId).select("tasks");

  if (!user) throw new CustomError("User not found", 404);

  const totalTasks = user.tasks.length;
  const paginatedTasks = user.tasks.slice(skip, skip + limit);

  res.send({
    tasks: paginatedTasks,
    currentPage: page,
    totalTasks,
    totalPages: Math.ceil(totalTasks / limit),
  });
};

const getSingleTask = async (req, res) => {
  const userId = req.userId; // Assuming user ID is passed as a route parameter
  const taskId = req.params.taskId; // Assuming task ID is passed as a route parameter

  // Find the user and retrieve only the specific task
  const user = await User.findOne(
    { _id: userId, "tasks._id": taskId },
    { "tasks.$": 1 } // Project only the matching task in the tasks array
  );

  if (!user || !user.tasks || user.tasks.length === 0) {
    throw new CustomError("Task not Found", 404);
  }
  res.send(user.tasks[0]);
};

const createTask = async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) throw new CustomError(error.details[0].message, 400);
  const task = new Task(req.body);

  const user = await User.findById(req.userId);
  console.log(user);
  if (!user) throw new CustomError("User doesn't exist", 400);
  user.tasks.push(task);
  await user.save();
  res.status(201).send(task);
};

const updateTask = async (req, res) => {
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
};

const deleteTask = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.userId },
    { $pull: { tasks: { _id: req.params.id } } }, // Remove the task with the matching _id
    { new: true } // Return the updated document
  );

  if (!user) throw new CustomError("User or Task not found", 400);
  res.send(user);
};

module.exports = { getAllTasks,getSingleTask, createTask, updateTask, deleteTask };
