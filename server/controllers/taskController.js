import TaskModel from '../models/Task.js'; 

// @desc    Get all tasks (Filtered by role)
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    let tasks;
    // If user is a standard 'user', only show tasks assigned to them
    if (req.user.role === 'user') {
      tasks = await TaskModel.find({ assignedTo: req.user._id }).populate('assignedTo', 'name email');
    } else {
      // Admins and Managers see all tasks for project oversight
      tasks = await TaskModel.find().populate('assignedTo', 'name email');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new task (Admin & Manager only)
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  const { title, description, status, priority, assignedTo, project, deadline } = req.body;
  try {
    const task = await TaskModel.create({
      title, description, status, priority, assignedTo, project, deadline
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Invalid task data' });
  }
};

// @desc    Update task status (Drag-and-Drop support)
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updatedTask = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

// @desc    Delete a task (Admin only)
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};