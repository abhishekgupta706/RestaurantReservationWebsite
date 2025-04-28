import { useState, useEffect } from 'react';
import axios from 'axios';
import consumerBackground from '../assets/consumer.jpg';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',                                                           
    mobile: '',
    visitors: '',
    date: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableSeats, setAvailableSeats] = useState(20); // Default to 20 seats

  useEffect(() => {
    const fetchAvailableSeats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please log in.');
          return;
        }

        const normalizedDate = formData.date ? new Date(formData.date).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0);
        const dateStr = new Date(normalizedDate).toISOString().split('T')[0];
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/reservations/availability?date=${dateStr}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Available seats response:', response.data);
        setAvailableSeats(response.data.availableSeats || 20);
      } catch (error) {
        console.error('Error fetching available seats:', error);
        setError(error.response?.data?.message || 'Failed to fetch available seats.');
      }
    };
    fetchAvailableSeats();
  }, [formData.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found. Please log in.');
      return;
    }

    if (formData.visitors < 1) {
      setError('Number of visitors must be at least 1');
      return;
    }
    if (formData.visitors > availableSeats) {
      setError(`Not enough available seats. Only ${availableSeats} seats left.`);
      return;
    }

    // Log formData to debug missing fields
    console.log('Submitting formData:', formData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/reservations`,
        {
          ...formData,
          date: new Date(formData.date).toISOString(), // Ensure date is in ISO format
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess(response.data.message);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        visitors: '',
        date: '',
        message: '',
      });

      // Fetch updated available seats
      const normalizedDate = formData.date ? new Date(formData.date).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0);
      const dateStr = new Date(normalizedDate).toISOString().split('T')[0];
      const responseUpdate = await axios.get(`${import.meta.env.VITE_API_URL}/reservations/availability?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableSeats(responseUpdate.data.availableSeats || 20);
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError(error.response?.data?.message || 'Failed to create reservation.');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center py-16"
      style={{ backgroundImage: `url(${consumerBackground})` }}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="backdrop-blur-md bg-black/60 rounded-2xl shadow-2xl p-8">
          <h2 className="text-4xl font-extrabold text-white mb-4 text-center tracking-tight">
            Make a Reservation
          </h2>
          <div className={availableSeats < formData.visitors ? "bg-red-500/90 text-white p-4 rounded-lg mb-8 text-center font-medium animate-fade-in" : "bg-green-500/90 text-white p-4 rounded-lg mb-8 text-center font-medium animate-fade-in"}>
            {`${availableSeats}/20 seats available`}
          </div>
          {error && (
            <div className="bg-red-500/90 text-white p-4 rounded-lg mb-8 text-center font-medium animate-fade-in">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/90 text-white p-4 rounded-lg mb-8 text-center font-medium animate-fade-in">
              {success}
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-gray-200 font-medium mb-2">Number of Visitors</label>
              <input
                type="number"
                placeholder="Number of Visitors"
                value={formData.visitors}
                onChange={(e) =>         
                  setFormData({ ...formData, visitors: parseInt(e.target.value) || 1 })
                }
                min="1"
                max={availableSeats}
                className="w-full p-3 bg-white/10 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>
            <div>    
              <label className="block text-gray-200 font-medium mb-2">Reservation Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 bg-white/10 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-200 font-medium mb-2">Additional Message</label>
              <textarea
                placeholder="Additional Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 bg-white/10 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 resize-y"
                rows="4"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105"
              >
                Reserve
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;