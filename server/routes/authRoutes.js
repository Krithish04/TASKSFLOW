import express from 'express';
import { registerUser, loginUser, getUsers, updateUserRole, deleteUser } from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin Only Management Routes
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUserRole);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

router.get('/employees', async (req, res) => {
  try {
    // 1. Log to server terminal to see if request arrives
    console.log("Fetching employees..."); 

    // 2. Query only users with the 'user' role
    // Use .lean() for faster, read-only performance
    const employees = await User.find({ role: 'user' }).select('name _id').lean();

    // 3. Send successful response
    res.status(200).json(employees);
  } catch (error) {
    console.error("Backend Error:", error.message);
    res.status(500).json({ message: "Server error while fetching users" });
  }
});

export default router;