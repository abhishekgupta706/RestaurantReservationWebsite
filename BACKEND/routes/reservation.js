const express = require('express');
const Reservation = require('../models/Reservation');
const SeatAvailability = require('../models/SeatAvailability');
const authMiddleware = require('../middleware/authMiddleware');
const { sendReservationEmail } = require('../utils/nodemailerConfig');

const router = express.Router();

// Get Available Seats for a Date
router.get('/availability', async (req, res) => {
  const { date } = req.query;
  try {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    let seatAvailability = await SeatAvailability.findOne({ date: normalizedDate });
    if (!seatAvailability) {
      seatAvailability = new SeatAvailability({ date: normalizedDate });
      await seatAvailability.save();
    }

    res.json({ availableSeats: seatAvailability.availableSeats });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Reservation
router.post('/', authMiddleware('customer'), async (req, res) => {
  const { name, email, mobile, visitors, date, message } = req.body;
  console.log('Received reservation request:', req.body);

  try {
    // Validate inputs
    if (!name || !email || !mobile || !visitors || !date) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    if (visitors < 1) {
      return res.status(400).json({ message: 'Number of visitors must be at least 1' });
    }
    
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Check and update available seats
    let seatAvailability = await SeatAvailability.findOne({ date: normalizedDate });
    if (!seatAvailability) {
      seatAvailability = new SeatAvailability({ date: normalizedDate });
      await seatAvailability.save();
    }

    if (seatAvailability.availableSeats < visitors) {
      return res.status(400).json({ message: `Not enough available seats. Only ${seatAvailability.availableSeats} seats left.` });
    }

    // Assign sequential seat IDs
    const lastSeatId = seatAvailability.lastSeatId;
    const newSeatIds = Array.from({ length: visitors }, (_, i) => lastSeatId + i + 1);

    // Create reservation
    const reservation = new Reservation({
      user: req.user.id,
      name,
      email,
      mobile,
      visitors,
      date: normalizedDate,
      seatIds: newSeatIds,
      message,
    });
    await reservation.save();

    // Update available seats and last seat ID
    seatAvailability.availableSeats -= visitors;
    seatAvailability.lastSeatId = lastSeatId + visitors;
    await seatAvailability.save();
     
    await sendReservationEmail(reservation);
    res.status(201).json({ message: 'Reservation created', reservation });
  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get User Reservations
router.get('/', authMiddleware('customer'), async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    console.error('Get user reservations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reschedule Reservation
router.put('/:id', authMiddleware('customer'), async (req, res) => {
  const { date, visitors } = req.body;
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    if (reservation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const oldDate = new Date(reservation.date);
    oldDate.setHours(0, 0, 0, 0);
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Restore available seats for the old date
    let oldSeatAvailability = await SeatAvailability.findOne({ date: oldDate });
    if (oldSeatAvailability) {
      oldSeatAvailability.availableSeats += reservation.visitors;
      await oldSeatAvailability.save();
    }

    // Check and update available seats for the new date
    let newSeatAvailability = await SeatAvailability.findOne({ date: normalizedDate });
    if (!newSeatAvailability) {
      newSeatAvailability = new SeatAvailability({ date: normalizedDate });
      await newSeatAvailability.save();
    }

    if (newSeatAvailability.availableSeats < visitors) {
      return res.status(400).json({ message: 'Not enough available seats for rescheduling' });
    }

    // Assign new sequential seat IDs
    const lastSeatId = newSeatAvailability.lastSeatId;
    const newSeatIds = Array.from({ length: visitors }, (_, i) => lastSeatId + i + 1);

    // Update reservation
    reservation.date = normalizedDate;
    reservation.seatIds = newSeatIds;
    
    reservation.visitors = visitors;
    await reservation.save();

    // Update available seats and last seat ID for the new date
    newSeatAvailability.availableSeats -= visitors;
    newSeatAvailability.lastSeatId = lastSeatId + visitors;
    await newSeatAvailability.save();

    await sendReservationEmail(reservation);
    res.json({ message: 'Reservation updated' });
  } catch (error) {
    console.error('Reschedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;   