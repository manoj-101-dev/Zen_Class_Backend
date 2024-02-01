import { createTask, getTasks, deleteTask } from "../models/taskModel.js";

// Function to create a new task
export const createTasks = async (req, res) => {
  try {
    const { frontendUrl, backendUrl, comments } = req.body;
    const newTask = await createTask({
      frontendUrl,
      backendUrl,
      comments,
      userId: req.decodedToken.userId,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to get all tasks
export const getTask = async (req, res) => {
  try {
    const tasks = await getTasks(req.decodedToken.userId);
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to delete a task
export const deleteTasks = async (req, res) => {
  try {
    const deletedTask = await deleteTask(req.params.id);
    res.status(200).json(deletedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
