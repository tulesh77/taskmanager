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
  
  subtasks: [
    {
      title: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }
  ],

  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo',
  },

  // 👇 NEW FIELD: This links the task to a specific user
  owner: {
    type: mongoose.Schema.Types.ObjectId, // Uses the User's unique ID format
    ref: 'User',                          // Points to the 'User' collection
    required: true,                       // A task MUST have an owner
  }
  // 👆 END NEW FIELD

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);