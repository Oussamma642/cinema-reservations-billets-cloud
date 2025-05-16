const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/reservations', require('./routes/reservations'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Reservations Service running on port ${PORT}`);
});
