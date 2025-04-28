const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const otps = new Map();

const sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps.set(email, otp);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,       
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
  setTimeout(() => otps.delete(email), 10 * 60 * 1000);
};

const verifyOtp = async (email, otp) => {
  return otps.get(email) === otp;
};

const sendReservationEmail = async (reservation) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: reservation.email,
    subject: 'Reservation Confirmation',
    html: `
      <h2>Reservation Details</h2>
      <p><strong>Name:</strong> ${reservation.name}</p>
      <p><strong>Date:</strong> ${new Date(reservation.date).toLocaleDateString()}</p>
      <p><strong>Seats:</strong> ${reservation.seats.join(', ')}</p>
      <p><strong>Status:</strong> ${reservation.status}</p>
      <p><strong>Message:</strong> ${reservation.message || 'None'}</p>
    `,
  };
             
  await transporter.sendMail(mailOptions);
};transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer configuration error:', error);
  } else {
    console.log('Nodemailer transporter ready');
  }
}); 
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);


module.exports = { sendOtp, verifyOtp, sendReservationEmail };