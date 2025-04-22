const Reservation = require('../models/Reservation');
const axios = require('axios');
const { authApi } = require('../services/api');

const ReservationController = {};

// Function to create a new reservation
ReservationController.createReservation = async (req, res) => {
    try {
        const { userId, seanceId, numberOfPlaces} = req.body;

        // Validate input
        if (!userId || !seanceId || !numberOfPlaces) {
            return res.status(400).json({ message: 'All fields are required: userId, seanceId, numberOfPlaces' });
        }

        // Get token from the front-end (usually in headers, or in localStorage/sessionStorage)
        const token = req.headers.authorization.split(' ')[1];  // Assuming the token is in the format 'Bearer <token>'


        // Check availability of the séance
        const seanceResponse = await authApi.get(`/seances/${seanceId}/availability`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const availablePlaces = seanceResponse.data.availablePlaces;

        if (numberOfPlaces > availablePlaces) {
            return res.status(400).json({ message: 'Not enough available places for this séance' });
        }

        // Calculate total price (assuming price is fetched from séance details)
        const seanceDetails = await authApi.get(`/seances/${seanceId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const pricePerPlace = seanceDetails.data.price;
        const totalPrice = pricePerPlace * numberOfPlaces;

        // Create the reservation
        const reservation = new Reservation({
            userId,
            seanceId,
            numberOfPlaces,
            totalPrice,
            status:'accepted'
        });

        await reservation.save();

        // Update the number of reserved places in the séance
        await authApi.put(`/seances/${seanceId}`, {
            reservedPlaces: numberOfPlaces,
        }, {
            headers: {
                'Authorization': `Bearer ${token}` // Send token to Laravel
            }
        });
        // await authApi.put(`/seances/${seanceId}`, {
        //     reservedPlaces: numberOfPlaces,
        // });

        res.status(201).json({ message: 'Reservation created successfully', reservation });
    }
    catch (error) {
        console.error('❌ ERROR:', error.message);
    
        if (error.response) {
            console.error('🧾 Response Data:', error.response.data);
            console.error('📡 Response Status:', error.response.status);
            console.error('📃 Response Headers:', error.response.headers);
        }
    
        res.status(500).json({ message: 'An error occurred while creating the reservation' });
    }
    //  catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'An error occurred while creating the reservation' });
    // }
};

module.exports = ReservationController;

