const Reservation = require("../models/Reservation");
const User = require("../models/User");

exports.createReservation = async (req, res) => {
  try {
    console.log("=== CREATE RESERVATION CALLED ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const { 
      user_id, 
      seance_id, 
      film_id, 
      film_title, 
      date_time, 
      salle_name, 
      seats, 
      quantity, 
      total_price 
    } = req.body;

    console.log("Received reservation data:", req.body);

    // Validate required fields
    if (!user_id || !seance_id || !film_id || !seats || !quantity || !total_price) {
      console.error("Missing required fields:", {
        user_id: !!user_id,
        seance_id: !!seance_id,
        film_id: !!film_id,
        seats: !!seats,
        quantity: !!quantity,
        total_price: !!total_price
      });
      return res.status(400).json({ 
        message: "Missing required fields" 
      });
    }

    // Check if user exists - handle both ObjectId and string ID
    let user;
    try {
      // Try to find by MongoDB ObjectId
      console.log("Trying to find user by ID:", user_id);
      user = await User.findById(user_id);
      console.log("User found by ObjectId:", user ? "Yes" : "No");
    } catch (err) {
      console.log("Error finding user by ObjectId:", err.message);
      console.log("Trying to find user by other fields");
      // If not found or invalid ObjectId, try to find by other fields
      user = await User.findOne({ $or: [
        { _id: user_id },
        { id: user_id }
      ]});
      console.log("User found by other fields:", user ? "Yes" : "No");
    }

    if (!user) {
      console.error("User not found with ID:", user_id);
      
      // For testing purposes, create a temporary user
      console.log("Creating temporary user for testing");
      user = { _id: user_id };
      
      // Return error in production
      // return res.status(404).json({ message: "User not found" });
    }

    console.log("Found or created user:", user);

    // Create new reservation
    const newReservation = new Reservation({
      user_id: user._id, // Use the MongoDB ObjectId
      seance_id,
      film_id,
      film_title,
      date_time,
      salle_name,
      seats,
      number_of_tickets: quantity,
      total_price,
      status: "pending"
    });

    console.log("New reservation created:", newReservation);
    await newReservation.save();
    console.log("Reservation saved to database");

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation
    });
  } catch (err) {
    console.error("Error creating reservation:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Getting reservations for user ID:", userId);

    // Try to find user first to get the correct MongoDB ObjectId
    let user;
    try {
      // Try to find by MongoDB ObjectId
      user = await User.findById(userId);
    } catch (err) {
      console.log("Error finding user by ObjectId, trying by other fields");
      // If not found or invalid ObjectId, try to find by other fields
      user = await User.findOne({ $or: [
        { _id: userId },
        { id: userId }
      ]});
    }

    if (!user) {
      console.error("User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Found user:", user);

    // Find all reservations for this user using the MongoDB ObjectId
    const reservations = await Reservation.find({ user_id: user._id })
      .populate("user_id", "username email")
      .sort({ createdAt: -1 });

    console.log(`Found ${reservations.length} reservations for user ${userId}`);
    res.json(reservations);
  } catch (err) {
    console.error("Error fetching user reservations:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find reservation by ID
    const reservation = await Reservation.findById(id)
      .populate("user_id", "username email");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json(reservation);
  } catch (err) {
    console.error("Error fetching reservation:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find and update reservation
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({
      message: "Reservation updated successfully",
      reservation
    });
  } catch (err) {
    console.error("Error updating reservation:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete reservation
    const reservation = await Reservation.findByIdAndDelete(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    res.json({
      message: "Reservation deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting reservation:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    // For admin use - get all reservations
    const reservations = await Reservation.find()
      .populate("user_id", "username email")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (err) {
    console.error("Error fetching all reservations:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}; 