import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 fixed w-full top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Restaurant
        </Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <ul
          className={`${
            isOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-gray-800 md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out`}
        >
          <li className="py-2 md:py-0">
            <Link
              to="/"
              className="hover:text-orange-500 transition block"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li className="py-2 md:py-0">
            <Link
              to="/reservations"
              className="hover:text-orange-500 transition block"
              onClick={() => setIsOpen(false)}
            >
              Reservations
            </Link>
          </li>
          <li className="py-2 md:py-0">
            <Link
              to="/contact"
              className="hover:text-orange-500 transition block"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </li>
          {isLoggedIn && (
            <li className="py-2 md:py-0">
              <Link
                to="/dashboard"
                className="hover:text-orange-500 transition block"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </li>
          )}
          <li className="py-2 md:py-0">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="hover:text-orange-500 transition block"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hover:text-orange-500 transition block"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </li>
          <li className="py-2 md:py-0">
            <Link
              to="/admin"
              className="hover:text-orange-500 transition block"
              onClick={() => setIsOpen(false)}
            >
             Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;