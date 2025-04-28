const mongoose = require('mongoose');

const seatAvailabilitySchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  availableSeats: { type: Number, default: 20 },
  lastSeatId: { type: Number, default: 0 }, // Tracks the last assigned seat ID
});

module.exports = mongoose.model('SeatAvailability', seatAvailabilitySchema);