import { useState, useEffect } from 'react';
import axios from 'axios';
import loginBackground from '../assets/login.jpg';
import consumerBackground from '../assets/consumer.jpg';

// Manual JWT decoding function
const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
  const [isOtpSent, setIsOtpSent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded && decoded.role === 'admin') {
        setIsAuthenticated(true);
        setIsAdmin(true);
        fetchReservations();
        fetchAnalytics();
      }
    }
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/reservations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservations(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Failed to fetch reservations. Please try again.');
    }
  };   

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('Analytics response:', response.data);
      setAnalytics(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to fetch analytics. Please try again.');
    }
  };

  const updateReservationStatus = async (id, status, email ) => {
    try {
      console.log('Updating reservation status hai bro :', id, status, email);
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/reservations/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      fetchReservations();
      fetchAnalytics();
      alert('Reservation status updated');
    } catch (error) {
      console.error('Error updating reservation:', error);
      setError(error.response?.data?.message || 'Failed to update reservation status.');
    }
  };

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isOtpSent || !formData.otp) {
      setError('Please enter the OTP');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
        role: 'admin',
        otp: formData.otp,
      });
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setIsAdmin(true);
      fetchReservations();
      fetchAnalytics();
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.response?.data?.message || 'Admin login failed. Please try again.');
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div
        className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center pt-20"
        style={{ backgroundImage: `url(${loginBackground})` }}
      >
        <div className="container mx-auto px-4 max-w-md">
          <div className="backdrop-blur-md bg-black/60 rounded-2xl shadow-2xl p-8">
            <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight">
              Admin Login
            </h2>
            {error && (
              <div className="bg-red-500/90 text-white p-4 rounded-lg mb-8 text-center font-medium animate-fade-in">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-6">
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
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed pt-20"
      style={{ backgroundImage: `url(${consumerBackground})` }}
    >
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="backdrop-blur-md bg-black/60 rounded-2xl shadow-2xl p-8">
          <h2 className="text-4xl font-extrabold text-white mb-10 text-center tracking-tight">
            Admin Dashboard
          </h2>
          {error && (
            <div className="bg-red-500/90 text-white p-4 rounded-lg mb-8 text-center font-medium animate-fade-in">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-white mb-6">Analytics</h3>
              {analytics ? (
                <div className="space-y-4 text-gray-200">
                  <p className="flex items-center">
                    <span className="font-medium w-40">Total Reservations:</span>
                    <span>{analytics.totalReservations}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-40">Pending Reservations:</span>
                    <span>{analytics.pendingReservations}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-40">Confirmed Reservations:</span>
                    <span>{analytics.confirmedReservations}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-40">Cancelled Reservations:</span>
                    <span>{analytics.cancelledReservations}</span>
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 animate-pulse">Loading analytics...</p>
              )}
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-white mb-6">Reservations</h3>
              {reservations.length > 0 ? (
                <div className="space-y-6">
                  {reservations.map((reservation) => (
                    <div
                      key={reservation._id}
                      className="border-b border-gray-600/50 pb-6 last:border-b-0"
                    >
                      <div className="space-y-3 text-gray-200">
                        <p className="flex items-center">
                          <span className="font-medium w-24">Name:</span>
                          <span className="flex-1">{reservation.name}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium w-24">Email:</span>
                          <span className="flex-1">{reservation.email}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium w-24">Date:</span>
                          <span className="flex-1">
                            {new Date(reservation.date).toLocaleDateString()}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium w-24">Seats:</span>
                          <span className="flex-1">{reservation.visitors}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium w-24">Status:</span>
                          <span className="flex-1">{reservation.status}</span>
                        </p>
                      </div>
                      {reservation.status === 'pending' && (
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() => updateReservationStatus(reservation._id, 'confirmed', reservation.email)}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateReservationStatus(reservation._id, 'cancelled', reservation.email)}  
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No reservations found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;