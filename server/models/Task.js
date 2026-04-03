import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'], // Matches your Kanban columns
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the User model we created earlier
    required: true
  },
  project: {
    type: String,
    required: true
  },
  deadline: {
    type: Date
  }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
export default Task;