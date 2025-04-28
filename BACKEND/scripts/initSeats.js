const mongoose = require('mongoose');
const Seat = require('../models/Seat');
const connectDB = require('../config/db');

const seatIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

const initializeSeats = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');

    const date = new Date('2025-04-24');
    date.setHours(0, 0, 0, 0);

    await Seat.deleteMany({ date });

    const seats = seatIds.map((seatId) => ({
      seatId,
      date,
      isBooked: false,
    }));

    await Seat.insertMany(seats);
    console.log('Seats initialized for', date.toISOString());
  } catch (error) {
    console.error('Error initializing seats:', error);
  } finally {
    mongoose.connection.close();
  }
};

initializeSeats();
