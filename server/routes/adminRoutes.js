import express from 'express';
import User from '../models/User.js';
import Project from '../models/Project.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Get System Statistics (Total Users, Managers, Projects)
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: 'user' });
    const managerCount = await User.countDocuments({ role: 'manager' });
    const projectCount = await Project.countDocuments();
    res.json({ userCount, managerCount, projectCount });
  } catch (error) {
    res.status(500).json({ message: "Stats fetch failed" });
  }
});

// 2. Update User Role (e.g., promote User to Manager)
router.patch('/user-role/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = req.body.role || user.role;
      await user.save();
      res.json({ message: "Role updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Role update failed" });
  }
});

// 3. Delete User Account
router.delete('/user/:id', protect, admin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User purged from system" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed" });
  }
});

// Add this to your existing adminRoutes.js
router.get('/all-tasks', protect, admin, async (req, res) => {
  try {
    const tasks = await Project.find({})
      .populate('createdBy', 'name email') // Get Manager info
      .populate('assignedTo', 'name email') // Get User info
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Task audit failed" });
  }
});

export default router;