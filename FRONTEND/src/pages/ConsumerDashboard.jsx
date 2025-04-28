import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const ConsumerDashboard = () => {
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const decoded = decodeJwt(token);
    if (!decoded || decoded.role !== 'customer') {
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }

    fetchUserDetails();
    fetchReservations();
  }, [navigate]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Failed to fetch user details.');
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reservations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setError('Failed to fetch reservations.');
    }
  };

  const rescheduleReservation = async (id, updatedData) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/reservations/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchReservations();
      alert('Reservation rescheduled');
    } catch (error) {
      console.error('Error rescheduling reservation:', error);
      setError('Failed to reschedule reservation.');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${consumerBackground})` }}
    >
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="backdrop-blur-md bg-black/60 rounded-2xl shadow-2xl p-8">
          <h2 className="text-4xl font-extrabold text-white mb-10 text-center tracking-tight">
            Customer Dashboard
          </h2>
          {error && (
            <div className="bg-red-500/90 text-white p-4 rounded-lg mb-8 text-center font-medium animate-fade-in">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Consumer Details */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl self-start">
              <h3 className="text-2xl font-semibold text-white mb-6">Your Details</h3>
              <div className="space-y-4 text-gray-200">
                <p className="flex items-center">
                  <span className="font-medium w-24">Name:</span>
                  <span className="flex-1">{user.name}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-24">Email:</span>
                  <span className="flex-1">{user.email}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-24">Mobile:</span>
                  <span className="flex-1">{user.mobile}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-24">Aadhar:</span>
                  <span className="flex-1">{user.aadhar}</span>
                </p>
              </div>
            </div>
            {/* Order Section */}
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
              <h3 className="text-2xl font-semibold text-white mb-6">Your Reservations</h3>
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
                          <span className="font-medium w-24">Mobile:</span>
                          <span className="flex-1">{reservation.mobile}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium w-24">Visitors:</span>
                          <span className="flex-1">{reservation.visitors}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium w-24">Date:</span>
                          <span className="flex-1">
                            {new Date(reservation.date).toLocaleDateString()}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium w-24">Seat IDs:</span>
                          <span className="flex-1">{reservation.seatIds?.join('') || 'N/A'}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium w-24">Message:</span>
                          <span className="flex-1">{reservation.message || 'N/A'}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium w-24">Status:</span>
                          <span className="flex-1">{reservation.status}</span>
                        </p>
                        <p className="flex items-center">
                          <span className="font-medium w-24">Created:</span>
                          <span className="flex-1">
                            {new Date(reservation.createdAt).toLocaleString()}
                          </span>
                        </p>
                      </div>
                      {reservation.status === 'pending' && (
                        <button
                          onClick={() =>
                            rescheduleReservation(reservation._id, {
                              date: prompt('Enter new date (YYYY-MM-DD):'),
                              visitors: parseInt(prompt('Enter number of visitors:')) || 1,
                            })
                          }
                          className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                        >
                          Reschedule
                        </button>
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
    // <>
    // <h1 className='pt-56'>Hello</h1>
    // </>
  );
};

export default ConsumerDashboard;