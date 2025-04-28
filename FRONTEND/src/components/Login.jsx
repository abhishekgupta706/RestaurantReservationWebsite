import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loginBackground from '../assets/login.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer',
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      localStorage.setItem('token', response.data.token);
      if (formData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/reservations');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials');
    }
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        email: formData.email,
      });
      alert('Password reset instructions sent to your email');
    } catch (error) {
      console.error('Error sending reset instructions:', error);
      alert('Error sending reset instructions');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center pt-20 md:pt-24 lg:pt-28"
      style={{ backgroundImage: `url(${loginBackground})` }}
    >
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 mx-4 transition-all duration-300">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-6 text-center tracking-tight">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full p-3 bg-white/20 text-white border border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:16px_12px]"
          >
            <option value="customer" className="bg-gray-800 text-white">Customer</option>
            <option value="admin" className="bg-gray-800 text-white">Admin</option>
          </select>
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-3 bg-white/20 text-white placeholder-gray-300 border border-gray-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full text-white hover:text-orange-300 transition-all duration-300 underline-offset-4 hover:underline"
          >
            Forgot Password?
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;