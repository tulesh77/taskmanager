// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // 👈 IMPORT THE SECURITY GUARD

// 1. GET ALL TASKS (Read ONLY my tasks)
router.get('/', auth, async (req, res) => { // 👈 ADD 'auth'
  try {
    // Only find tasks where owner matches the logged-in user's ID
    const tasks = await Task.find({ owner: req.userId }); 
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE A TASK (Write with my ID)
router.post('/', auth, async (req, res) => { // 👈 ADD 'auth'
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      owner: req.userId // 👈 AUTOMATICALLY ASSIGN OWNER
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. DELETE A TASK (Delete only if I own it)
router.delete('/:id', auth, async (req, res) => { // 👈 ADD 'auth'
  try {
    const { id } = req.params;
    // Find a task that has BOTH the correct ID AND belongs to this user
    const task = await Task.findOneAndDelete({ _id: id, owner: req.userId });
    
    if (!task) return res.status(404).json({ message: 'Task not found or not authorized' });
    
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. ADD A SUB-TASK (Update only if I own it)
router.post('/:id/subtasks', auth, async (req, res) => { // 👈 ADD 'auth'
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    // Find task by ID and Owner
    const task = await Task.findOne({ _id: id, owner: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found or not authorized' });

    task.subtasks.push({ title });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;