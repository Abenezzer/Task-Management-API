const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

const {
  getAllTasks,
  getSingleTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", auth, getAllTasks);
router.get('/:taskId', auth, getSingleTask);
router.post("/", auth, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

module.exports = router;
