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


// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// // —————— بيانات وهمية لـ seances ——————
// const seances = [{
//   id: '1',           // مثال
//   price: 50,
//   capacity: 100,
//   reservedPlaces: 20
// }];

// // 1. التحقق من التوفر
// app.get("/api/seances/:id/availability", (req, res) => {
//   const s = seances.find(s => s.id === req.params.id);
//   if (!s) return res.status(404).json({ message: "Séance not found" });
//   res.json({ availablePlaces: s.capacity - s.reservedPlaces });
// });

// // 2. جلب تفاصيل السيانس
// app.get("/api/seances/:id", (req, res) => {
//   const s = seances.find(s => s.id === req.params.id);
//   if (!s) return res.status(404).json({ message: "Séance not found" });
//   res.json({ price: s.price, reservedPlaces: s.reservedPlaces, capacity: s.capacity });
// });

// // 3. تحديث الأماكن المحجوزة
// app.patch("/api/seances/:id/update-places", (req, res) => {
//   const s = seances.find(s => s.id === req.params.id);
//   if (!s) return res.status(404).json({ message: "Séance not found" });
//   const { reservedPlaces } = req.body;
//   s.reservedPlaces += reservedPlaces;
//   res.json({ message: "Updated", reservedPlaces: s.reservedPlaces });
// });

// // —————— ربط قاعدة بيانات MongoDB ——————
// mongoose
//   .connect("mongodb://localhost:27017/oc-reservation-service")
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB error:", err));

// // —————— ربط مسارات الحجز ——————
// // const reservationRoute = require("./routes/reservations");
// // app.use("/api", reservationRoute);

// // —————— تشغيل الخادم ——————
// const PORT = 5002;
// app.listen(PORT, () => console.log(`Reservation Service running on port ${PORT}`));
