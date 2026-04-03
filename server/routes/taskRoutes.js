import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All task routes require being logged in
router.use(protect);

// Routes with specific role permissions
router.route('/')
  .get(getTasks) // Everyone can view their permitted tasks
  .post(authorize('admin', 'manager'), createTask); // Only Admin/Manager can create

router.route('/:id')
  .put(updateTask) // Users can update status; Managers can update details
  .delete(authorize('admin'), deleteTask); // Only Admins can delete tasks

export default router;