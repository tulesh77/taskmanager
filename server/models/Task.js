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

  // 👇 LEVEL 3 NEW FIELD: Category (Work, Personal, Urgent)
  category: {
    type: String,
    enum: ['Work', 'Personal', 'Urgent'], // Restricts input to these 3 choices
    default: 'Personal',
  },
  // 👆 END NEW FIELD

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

  // 👇 This links the task to a specific user (Privacy)
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',                          
    required: true,                       
  }

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);