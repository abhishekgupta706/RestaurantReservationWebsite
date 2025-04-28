const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOtp, verifyOtp } = require('../utils/nodemailerConfig');
require('dotenv').config();

const router = express.Router();

// Fixed admin credentials
const ADMIN_EMAIL = 'guptaabhishek9717@gmail.com';
const ADMIN_PASSWORD = 'Abhishek@2003';

// Register (for customers only)
router.post('/register', async (req, res) => {
  const { name, email, mobile, aadhar, password, otp } = req.body;
  try {
    const isOtpValid = await verifyOtp(email, otp);
    if (!isOtpValid) return res.status(400).json({ message: 'Invalid OTP' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = await User.findOne({ aadhar });
    if (user) return res.status(400).json({ message: 'Aadhar number already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, mobile, aadhar, password: hashedPassword, role: 'customer' });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (role === 'admin') {
      if (email !== ADMIN_EMAIL) {
        return res.status(400).json({ message: 'Invalid admin email' });
      }
      const isMatch = password === ADMIN_PASSWORD; // Note: In production, hash this
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid admin password' });
      }
      let adminUser = await User.findOne({ email });
      if (!adminUser) {
        adminUser = new User({
          name: 'Admin',
          email: ADMIN_EMAIL,
          mobile: '0000000000',
          aadhar: '000000000000',
          password: await bcrypt.hash(ADMIN_PASSWORD, 10),
          role: 'admin',
        });
        await adminUser.save();
      }
      const token = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      return res.json({ token });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.role !== 'customer') {
      return res.status(400).json({ message: 'Only customers can log in here' });
    }

    const token = jwt.sign({ id: user._id, role: 'customer' }, process.env.JWT_SECRET, {
        expiresIn: '12h',
    });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details (for consumer dashboard)
router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'customer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  try {
    await sendOtp(email);
    res.json({ message: 'OTP sent' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password (for customers only)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Password reset not allowed for admin' });
    }
    await sendOtp(email);
    res.json({ message: 'OTP sent for password reset' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password (for customers only)
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const isOtpValid = await verifyOtp(email, otp);
    if (!isOtpValid) return res.status(400).json({ message: 'Invalid OTP' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Password reset not allowed for admin' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
module.exports.ADMIN_EMAIL = ADMIN_EMAIL;
module.exports.ADMIN_PASSWORD = ADMIN_PASSWORD;