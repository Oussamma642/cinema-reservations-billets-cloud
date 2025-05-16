require('dotenv').config(); 

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  console.log('Auth middleware called for path:', req.path);
  console.log('Headers:', req.headers);
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided in Authorization header');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token found:', token.substring(0, 10) + '...');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully. User:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

module.exports = verifyToken;
