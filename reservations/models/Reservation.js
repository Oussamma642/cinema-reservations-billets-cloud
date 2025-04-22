// models/Reservation.js
const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  seanceId: {
    type: String,
    required: true,
  },
  numberOfPlaces: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ⚠️ Prevent the same user from reserving the same seance twice
reservationSchema.index(
  { userId: 1, seanceId: 1 },
  { unique: true, name: "unique_user_seance" }
);

module.exports = mongoose.model("Reservation", reservationSchema, "reservations");