const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/ReservationController');

const verifyToken = require('../middleware/authMiddleware');

// Route to create a new reservation
router.post('/reservations', verifyToken , ReservationController.createReservation);

// Route to get all reservations for a user
router.get('/reservations', verifyToken , ReservationController.getAllReservations);

// Route to get reservations for a specific user
router.get('/reservations/:userId', verifyToken , ReservationController.getReservationsForUser);

module.exports = router;