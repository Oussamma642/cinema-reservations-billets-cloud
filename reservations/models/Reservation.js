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

module.exports = mongoose.model(
  "Reservation",
  reservationSchema,
  "reservations"
);
