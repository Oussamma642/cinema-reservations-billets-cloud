// routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, verifyToken } = require('../controllers/authController');
const { 
  createReservation, 
  getUserReservations, 
  getReservation, 
  updateReservation, 
  deleteReservation,
  getAllReservations
} = require('../controllers/reservationController');
const verifyTokenMiddleware = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/users', verifyTokenMiddleware, getAllUsers);
router.get('/verify', verifyTokenMiddleware, verifyToken);

// Test endpoint - no auth required
router.get('/test', (req, res) => {
  res.json({ message: 'Auth service is working!' });
});

// Test reservation endpoint - no auth required
router.post('/reservations/test', (req, res) => {
  console.log('Test reservation endpoint called with body:', req.body);
  res.json({ 
    message: 'Reservation test endpoint is working!',
    receivedData: req.body
  });
});

// Reservation routes
// Temporarily remove auth requirement for testing
router.post('/reservations', createReservation);
router.get('/reservations', getAllReservations);
// Specific route must come before generic route
router.get('/reservations/user/:userId', getUserReservations);
router.get('/reservations/:id', getReservation);
router.put('/reservations/:id', updateReservation);
router.delete('/reservations/:id', deleteReservation);

module.exports = router;