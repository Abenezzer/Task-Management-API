const mongoose = require("mongoose");
const Joi = require("joi");

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

const Task = mongoose.model("Task", taskSchema);

function validateTask(task) {
  return Joi.object({
    title: Joi.string().required().min(3).max(255),
    description: Joi.string().required().min(5).max(255),
    status: Joi.string().valid("pending", "completed").optional(),
    dueDate: Joi.date().optional(),
    priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
  }).validate(task);
}

module.exports = {taskSchema, Task, validateTask};