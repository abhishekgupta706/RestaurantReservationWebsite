import { useState } from 'react';
import axios from 'axios';
import loginBackground from '../assets/login.jpg';

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    aadhar: '',
    password: '',
    role: 'customer',
    otp: '',
  });
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');

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
    if (!isOtpSent || !formData.otp) {
      setError('Please enter the OTP');
      return;
    }
    try {
      if (isLogin) {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          otp: formData.otp,
        });
        localStorage.setItem('token', response.data.token);
        onLogin(formData.role);
      } else {
        if (formData.role === 'admin') {
          setError('Admin registration is not allowed');
          return;
        }
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          aadhar: formData.aadhar,
          password: formData.password,
          otp: formData.otp,
        });
        alert('Registration successful! Please log in.');
        setIsLogin(true);
        setFormData({ ...formData, name: '', mobile: '', aadhar: '', password: '', otp: '' });
        setIsOtpSent(false);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.response?.data?.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center pt-20"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="container mx-auto px-4 max-w-md">
        <div className="backdrop-blur-md bg-black/60 rounded-2xl shadow-2xl p-8">
          <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight">
            {isLogin ? 'Login' : 'Register'}
          </h2>
          {error && (
            <div className="bg-red-500/90 text-white p-4 rounded-lg mb-8 text-center font-medium animate-fade-in">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-gray-200 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 font-medium mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 font-medium mb-2">Aadhar Number</label>
                  <input
                    type="text"
                    placeholder="Aadhar Number"
                    value={formData.aadhar}
                    onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    required
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-gray-200 font-medium mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 bg-white/10 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>
            <div>
              <label className="block text-gray-200 font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 bg-white/10 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>
            {isLogin && (
              <div>
                <label className="block text-gray-200 font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={sendOtp}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Send OTP
              </button>
            </div>
            {isOtpSent && (
              <div>
                <label className="block text-gray-200 font-medium mb-2">Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="w-full p-3 bg-white/10 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  required
                />
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600/50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={!isOtpSent}
              >
                {isLogin ? 'Login' : 'Register'}
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ ...formData, name: '', mobile: '', aadhar: '', password: '', otp: '' });
                  setIsOtpSent(false);
                  setError('');
                }}
                className="w-full text-blue-400 hover:text-blue-300 transition-all duration-300 underline-offset-4 hover:underline"
              >
                {isLogin ? 'Need to register?' : 'Already registered? Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;