// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- NEW STEP: Import the routes ---
const taskRoutes = require('./routes/taskRoutes'); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- NEW STEP: Use the routes ---
// Any URL starting with /api/tasks will go to taskRoutes
app.use('/api/tasks', taskRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});