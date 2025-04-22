const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/oc-reservation-service")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

const reservationRoute = require("./routes/reservations");
app.use("/api", reservationRoute);

app.listen(5002, () => console.log("Enrollment Service running on port 5002"));
