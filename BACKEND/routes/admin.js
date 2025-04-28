const express = require('express');
const nodemailer = require('nodemailer');
const Reservation = require('../models/Reservation');
// const Seat = require('../models/Seat');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer configuration error:', error);
  } else {
    console.log('Nodemailer transporter ready');
  }
});

// Get all reservations (admin only)
router.get('/reservations', authMiddleware('admin'), async (req, res) => {
  try {
    console.log('Admin email:', process.env.EMAIL_USER);
    const reservations = await Reservation.find().sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(reservations);
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics (admin only)
router.get('/analytics', authMiddleware('admin'), async (req, res) => {
  try {
    const totalReservations = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    const confirmedReservations = await Reservation.countDocuments({ status: 'confirmed' });
    const cancelledReservations = await Reservation.countDocuments({ status: 'cancelled' });
    // const totalSeats = await Seat.countDocuments();
    // const bookedSeats = await Seat.countDocuments({ isBooked: true });

    res.json({
      totalReservations,
      pendingReservations,
      confirmedReservations,
      cancelledReservations,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update reservation status (admin only)
router.put('/reservations/:id', authMiddleware('admin'), async (req, res) => {
  const { status } = req.body;
  try {
    const reservation = await Reservation.findById(req.params.id).populate('user', 'name email');
    console.log('Reservation:', reservation);
    console.log('Email to send:', reservation?.user?.email);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    reservation.status = status;
    await reservation.save();

    // Send email if status is confirmed or cancelled
    if (status === 'confirmed' || status === 'cancelled') {
      console.log('Preparing to send email for status:', status);
      if (!reservation.user || !reservation.user.email) {
        console.log('Missing user or email:', { user: reservation.user });
        return res.status(400).json({ message: 'User email not found' });
      }
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Missing email credentials');
        return res.status(500).json({ message: 'Email credentials not configured' });
      }
         
      try {
        const statusText = status === 'confirmed' ? 'Confirmed' : 'Cancelled';

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: reservation.user.email,
          subject: `Reservation ${statusText}`,
          html: `
            <h2>Reservation ${statusText}</h2>
            <p>Dear ${reservation.user.name},</p>
            <p>Your reservation has been ${statusText.toLowerCase()} with the following details:</p>
            <ul>
              <li><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</li>
              <li><strong>Number of Seats:</strong> ${reservation.visitors}</li>
            </ul>
            <p>${
              status === 'confirmed'
                ? 'Thank you for your reservation. We look forward to serving you!'
                : 'We regret to inform you that your reservation has been cancelled. Please contact us for further assistance.'
            }</p>
            <p>Best regards,<br>Your Reservation Team</p>
          `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.json({ message: `Reservation status updated to ${status} and email sent` });
      } catch (emailError) {
        console.error('Email error details:', {
          message: emailError.message,
          code: emailError.code,
          stack: emailError.stack,
        });
        return res.status(207).json({
          message: `Reservation status updated to ${status}, but failed to send email`,
        });
      }
    } else {
      res.json({ message: `Reservation status updated to ${status}` });
    }
  } catch (error) {
    console.error('Update reservation error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;