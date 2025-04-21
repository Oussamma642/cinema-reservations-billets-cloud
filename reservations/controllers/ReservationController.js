const Reservation = require('../models/Reservation');
const axios = require('axios');

const ReservationController = {};

// Function to create a new reservation
ReservationController.createReservation = async (req, res) => {
    try {
        const { userId, seanceId, numberOfPlaces } = req.body;

        // Validate input
        if (!userId || !seanceId || !numberOfPlaces) {
            return res.status(400).json({ message: 'All fields are required: userId, seanceId, numberOfPlaces' });
        }

        // Check availability of the séance
        const seanceResponse = await axios.get(`http://localhost:8000/seances/${seanceId}/availability`);
        const availablePlaces = seanceResponse.data.availablePlaces;

        if (numberOfPlaces > availablePlaces) {
            return res.status(400).json({ message: 'Not enough available places for this séance' });
        }

        // Calculate total price (assuming price is fetched from séance details)
        const seanceDetails = await axios.get(`http://localhost:8000/seances/${seanceId}`);
        const pricePerPlace = seanceDetails.data.price;
        const totalPrice = pricePerPlace * numberOfPlaces;

        // Create the reservation
        const reservation = new Reservation({
            userId,
            seanceId,
            numberOfPlaces,
            totalPrice,
        });

        await reservation.save();

        // Update the number of reserved places in the séance
        await axios.patch(`http://localhost:8000/seances/${seanceId}/update-places`, {
            reservedPlaces: numberOfPlaces,
        });

        res.status(201).json({ message: 'Reservation created successfully', reservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the reservation' });
    }
};

module.exports = ReservationController;

