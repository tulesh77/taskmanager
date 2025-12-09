// server/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  
  // 👇 THIS IS THE MISSING PART 👇
  subtasks: [
    {
      title: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }
  ],
  // 👆 YOU NEED THIS FOR SUBTASKS TO WORK 👆

  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);