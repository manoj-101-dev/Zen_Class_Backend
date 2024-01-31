// Function to create a new task
export const createTask = async (req, res) => {
  try {
    // Assuming you have a Task model
    const { frontendUrl, backendUrl, comments } = req.body;
    const newTask = new Task({
      frontendUrl,
      backendUrl,
      comments,
      userId: req.decodedToken.userId, // Assuming userId is included in the decoded token
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to get all tasks
export const getTasks = async (req, res) => {
  try {
    // Assuming you have a Task model
    const tasks = await Task.find({ userId: req.decodedToken.userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to delete a task
export const deleteTask = async (req, res) => {
  try {
    // Assuming you have a Task model
    const deletedTask = await Task.findByIdAndRemove(req.params.id);
    res.status(200).json(deletedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
