// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Needed for security
const jwt = require('jsonwebtoken'); // Needed for the "Key"
const User = require('./models/User'); // Import your User model

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = 'mysupersecretkey123'; // Keep this safe!

// -------------------------------------------
// 👇 DIRECT AUTH ROUTES (No external file needed)
// -------------------------------------------

// 1. REGISTER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already taken" });

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. LOGIN (This was missing before!)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// -------------------------------------------

// Import Task Routes
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});