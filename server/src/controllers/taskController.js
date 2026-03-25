import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  req.app.get("io").emit("tasks_changed");
  res.json(task);
};

export const toggleTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  req.app.get("io").emit("tasks_changed");
  res.json(task);
};

export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  req.app.get("io").emit("tasks_changed");
  res.json({ message: "Deleted" });
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    req.app.get("io").emit("tasks_changed");
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};