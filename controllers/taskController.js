const tasks = [];

export const getTasks = (req, res) => {
  res.json(tasks);
};

export const addTask = (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  res.json(newTask);
};
