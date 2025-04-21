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


/*
// Function to check availability for a specific séance
ReservationController.checkAvailability = async (req, res) => {
    try {
        const { seanceId } = req.params;

        // Validate input
        if (!seanceId) {
            return res.status(400).json({ message: 'Séance ID is required' });
        }

        // Fetch availability from the séance service
        const seanceResponse = await axios.get(`http://localhost:3000/seances/${seanceId}/availability`);
        const availablePlaces = seanceResponse.data.availablePlaces;

        res.status(200).json({ seanceId, availablePlaces });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while checking availability' });
    }
};

// Function to update the number of reserved places for a specific séance
ReservationController.updateReservedPlaces = async (req, res) => {
    try {
        const { seanceId } = req.params;
        const { reservedPlaces } = req.body;

        // Validate input
        if (!seanceId || reservedPlaces === undefined) {
            return res.status(400).json({ message: 'Séance ID and reservedPlaces are required' });
        }

        // Update reserved places in the séance service
        const updateResponse = await axios.patch(`http://localhost:3000/seances/${seanceId}/update-places`, {
            reservedPlaces,
        });

        res.status(200).json({ message: 'Reserved places updated successfully', data: updateResponse.data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating reserved places' });
    }
};

// Function to get reservation history for a specific user
ReservationController.getReservationHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate input
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Fetch reservations from the database
        const reservations = await Reservation.find({ userId });

        res.status(200).json({ userId, reservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching reservation history' });
    }
};
*/


module.exports = ReservationController;

