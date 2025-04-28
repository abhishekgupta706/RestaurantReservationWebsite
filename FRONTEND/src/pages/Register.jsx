import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    aadhar: '',
    password: '',
    otp: '',
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!formData.email) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
        email: formData.email,
      });
      setIsOtpSent(true);       
      setError(''); 
      alert('OTP sent to your email');
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isOtpSent || !formData.otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      setSuccess('Registration successful. Please log in.');
      setFormData({
        name: '',
        email: '',
        mobile: '',
        aadhar: '',
        password: '',
        otp: '',
      });
      setIsOtpSent(false);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="container mx-auto pt-24 max-w-md bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Register
      </h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 text-center">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <input
          type="tel"
          placeholder="Mobile Number"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <input
          type="text"
          placeholder="Aadhar Number"
          value={formData.aadhar}
          onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={sendOtp}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Send OTP
          </button>
        </div>
        {isOtpSent && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        )}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!isOtpSent}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;