// server/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); 

// 1. GET ALL TASKS (Read ONLY my tasks)
router.get('/', auth, async (req, res) => { 
  try {
    // Only find tasks where owner matches the logged-in user's ID
    const tasks = await Task.find({ owner: req.userId }); 
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE A TASK (Write with my ID & Category)
router.post('/', auth, async (req, res) => { 
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      owner: req.userId, 
      // 👇 NEW: Save the category (Default to 'Personal' if missing)
      category: req.body.category || 'Personal' 
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. DELETE A TASK (Delete only if I own it)
router.delete('/:id', auth, async (req, res) => { 
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, owner: req.userId });
    
    if (!task) return res.status(404).json({ message: 'Task not found or not authorized' });
    
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. ADD A SUB-TASK
router.post('/:id/subtasks', auth, async (req, res) => { 
  try {
    const { id } = req.params;
    const { title } = req.body;
    
    const task = await Task.findOne({ _id: id, owner: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found or not authorized' });

    task.subtasks.push({ title });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. UPDATE A TASK (Mark as Done, Edit Title, OR Change Category)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    // 👇 NEW: Accept 'category' in the update
    const { status, title, category } = req.body; 

    const task = await Task.findOne({ _id: id, owner: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Update fields if they are sent
    if (status) task.status = status;
    if (title) task.title = title;
    if (category) task.category = category; // 👇 Apply the category change
    
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;