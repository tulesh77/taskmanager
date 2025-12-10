// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Add these libraries directly here
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Create a User model instance directly if needed, or import it
const User = require('./models/User'); 

const app = express();
app.use(express.json());
app.use(cors());

// --- DIRECT DEBUG ROUTE ---
app.get('/api/auth/debug', (req, res) => {
  res.send('DIRECT AUTH ROUTE IS WORKING');
});

// --- DIRECT REGISTER ROUTE ---
app.post('/api/auth/register', async (req, res) => {
  console.log("👉 Register Hit");
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Import other routes normally
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});