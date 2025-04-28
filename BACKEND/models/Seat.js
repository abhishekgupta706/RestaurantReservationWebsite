const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatId: { type: Number, required: true, unique: true },
  date: { type: Date, required: true },
  isBooked: { type: Boolean, default: false },
  reservation: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
});

module.exports = mongoose.model('Seat', seatSchema);