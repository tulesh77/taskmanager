 // server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// 1. GET ALL TASKS (Read)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks from DB
    res.json(tasks); // Send them back to the user
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE A TASK (Write)
router.post('/', async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
    });
    const savedTask = await newTask.save(); // Save to DB
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// 3. DELETE A TASK
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id); 
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;