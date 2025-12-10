// server/middleware/auth.js
const jwt = require('jsonwebtoken');

// IMPORTANT: Use the same secret key you used in index.js
const JWT_SECRET = 'mysupersecretkey123'; 

const auth = (req, res, next) => {
  // 1. Check for the token in the header (where the frontend puts it)
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 2. Verify the token and extract the user data
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Attach the user's ID to the request object
    req.userId = decoded.id; 
    
    // 4. Continue to the next function (the Task route handler)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;