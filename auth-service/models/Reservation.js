const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.Mixed,
      required: true,
    },
    seance_id: {
      type: String,
      required: true,
    },
    film_id: {
      type: String,
      required: true,
    },
    film_title: {
      type: String,
      required: true,
    },
    date_time: {
      type: String,
      required: true,
    },
    salle_name: {
      type: String,
      required: true,
    },
    seats: {
      type: [Number],
      required: true,
    },
    number_of_tickets: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema); 