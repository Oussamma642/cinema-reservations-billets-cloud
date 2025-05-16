const Reservation = require("../models/Reservation");
const { authApi } = require("../services/api");

const ReservationController = {};

// Function to create a new reservation
ReservationController.createReservation = async (req, res) => {
  try {
    const { userId, seanceId, numberOfPlaces } = req.body;

    // Validate input
    if (!userId || !seanceId || !numberOfPlaces) {
      return res.status(400).json({
        message: "All fields are required: userId, seanceId, numberOfPlaces",
      });
    }

    // Get token from the front-end (usually in headers, or in localStorage/sessionStorage)
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is in the format 'Bearer <token>'

    // Check availability of the séance
    const seanceResponse = await authApi.get(
      `/seances/${seanceId}/availability`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const availablePlaces = seanceResponse.data.availablePlaces;

    if (numberOfPlaces > availablePlaces) {
      return res
        .status(400)
        .json({ message: availablePlaces + " places available only " });
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
      status: "accepted",
    });

    await reservation.save();

    // Update the number of reserved places in the séance
    await authApi.put(
      `/seances/${seanceId}`,
      {
        reservedPlaces: numberOfPlaces,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Send token to Laravel
        },
      }
    );
    res
      .status(201)
      .json({ message: "Reservation created successfully", reservation });
  } catch (error) {
    console.error("❌ ERROR:", error.message);

    if (error.code === 11000) {
        return res.status(400).json({ message: 'You already have a reservation for this séance' });
      }
    if (error.response) {
      console.error("🧾 Response Data:", error.response.data);
      console.error("📡 Response Status:", error.response.status);
      console.error("📃 Response Headers:", error.response.headers);
    }

    res
      .status(500)
      .json({ message: "An error occurred while creating the reservation" });
  }

};

// Function to get all reservations with populated seanceId and userId

ReservationController.getAllReservations = async (req, res) => {
  try {
    // Fetch all reservations and populate both 'seanceId' and 'userId' fields
    const reservations = await Reservation.find({})
      .populate("seanceId") // Populate 'seanceId' with full details of the Seance document
      .populate("userId"); // Populate 'userId' with full details of the User document

    res.json(reservations); // Send the populated reservations as the response
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while fetching all reservations" });
  }
};

// Function to get reservations for a specific user
ReservationController.getReservationsForUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log('User ID:', userId);  // Log to verify the userId
  
      const reservations = await Reservation.find({ userId })
        .populate('seanceId')  // Populating the seanceId field with full details
        .populate('userId');   // Populating the userId field with full user details
  
      if (reservations.length === 0) {
        return res.status(404).json({ message: 'No reservations found for this user' });
      }
  
      res.json(reservations);  // Send the populated reservations for the user
    } catch (error) {
      console.error('❌ ERROR:', error.message);
      res.status(500).json({ message: 'An error occurred while fetching reservations for the user' });
    }
};
  

module.exports = ReservationController;
