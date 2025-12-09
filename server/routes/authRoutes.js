

// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();

console.log("------------------ AUTH ROUTES LOADED ------------------"); // <--- ADD THIS

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SECRET KEY (In production, put this in .env!)
const JWT_SECRET = 'mysupersecretkey123'; 

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate Token (The "Key")
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;