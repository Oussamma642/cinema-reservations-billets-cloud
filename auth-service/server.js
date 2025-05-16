const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

const authRoutes = require('./routes/auth');

// Define JWT_SECRET for the application
process.env.JWT_SECRET = process.env.JWT_SECRET || 'cinema_reservation_jwt_secret_key';

// Middleware
app.use(express.json());

// Configure CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const MONGO_URI = 'mongodb://localhost:27017/oc-auth-service';
const PORT = 5000;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB connection error", err));

// Use auth routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message
  });
});

// Start server
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));


