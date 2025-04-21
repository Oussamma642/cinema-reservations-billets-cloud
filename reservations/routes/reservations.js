const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/ReservationController');

const verifyToken = require('../middleware/authMiddleware');

// Route to create a new reservation
router.post('/reservations',verifyToken ,ReservationController.createReservation);

module.exports = router;