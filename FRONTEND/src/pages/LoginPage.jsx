import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import loginBackground from '../assets/login.jpg';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
        role: 'customer',
      });
      localStorage.setItem('token', response.data.token);
      login();
      setSuccess('Login successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMsg);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!formData.email || !newPassword) {
      setError('Please enter email and new password');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, {
        email: formData.email,
        newPassword,
      });
      setSuccess('Password reset successful. Please log in.');
      setIsForgotPassword(false);
      setFormData({ email: '', password: '' });
      setNewPassword('');
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center pt-20 md:pt-24 lg:pt-28"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mx-4 transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 text-center tracking-tight">
          {isForgotPassword ? 'Reset Password' : 'Consumer Login'}
        </h2>
        {error && (
          <div className="bg-red-500/90 text-white p-4 rounded-lg mb-6 text-center font-medium animate-fade-in">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/90 text-white p-4 rounded-lg mb-6 text-center font-medium animate-fade-in">
            {success}
          </div>
        )}
        <form onSubmit={isForgotPassword ? handleForgotPassword : handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            required
          />
          {!isForgotPassword && (
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              required
            />
          )}
          {isForgotPassword && (
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              required
            />
          )}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
          >
            {isForgotPassword ? 'Reset Password' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsForgotPassword(!isForgotPassword);
              setError('');
              setSuccess('');
              setFormData({ email: '', password: '' });
              setNewPassword('');
            }}
            className="w-full text-white hover:text-orange-300 transition-all duration-300 underline-offset-4 hover:underline"
          >
            {isForgotPassword ? 'Back to Login' : 'Forgot Password?'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-white">
            Not registered?{' '}
            <Link
              to="/register"
              className="text-orange-500 hover:text-orange-600 underline transition-all duration-300"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;