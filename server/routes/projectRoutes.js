import express from 'express';
import Project from '../models/Project.js';
// Assuming you have a protect middleware to get the manager's ID
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, async (req, res) => {
  try {
    const { title, description, assignedTo, deadline } = req.body;

    const newProject = await Project.create({
      title,
      description,
      assignedTo,
      deadline,
      createdBy: req.user._id // The Manager who is logged in
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Task Creation Error:", error.message);
    res.status(400).json({ message: "Invalid project data or missing fields" });
  }
});

router.get('/my-tasks', protect, async (req, res) => {
  try {
    // req.user._id comes from the 'protect' middleware
    const tasks = await Project.find({ assignedTo: req.user._id })
      .populate('createdBy', 'name') // Shows the Manager's name too
      .sort({ createdAt: -1 }); // Newest tasks first

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your tasks" });
  }
});

router.put('/:id', protect, async (req, res) => {
  const task = await Project.findById(req.params.id);
  if (task) {
    task.status = req.body.status || task.status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404).json({ message: "Task not found" });
  }
});


// 1. Get all projects created by this manager
router.get('/manager-tasks', protect, async (req, res) => {
  try {
    const tasks = await Project.find({ createdBy: req.user._id })
      .populate('assignedTo', 'name email') // Get the employee's name/email
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching management list" });
  }
});

// 2. Delete a specific task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Project.findById(req.params.id);
    
    // Safety check: Only the creator can delete it
    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to delete this" });
    }

    await task.deleteOne();
    res.json({ message: "Task removed from system" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed" });
  }
});

export default router;