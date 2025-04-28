import React from 'react';
import { FaInstagram, FaLinkedin, FaGithub, FaWhatsapp, FaArrowUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black text-gray-300 pt-24 pb-14 px-6 overflow-hidden isolate">
     

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6 lg:px-0 relative z-10">
        {/* Contact Info */}
        <div className="relative p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md ">
          <h3 className="text-2xl font-bold text-white mb-3 tracking-widest">RESTRO</h3>
          <p className="text-sm leading-relaxed">Village-Jashara Post Sachui District Mau</p>
          <p className="text-sm">Email: guptaabhishek9717@gmail.com</p>
          <p className="text-sm">Phone: +91 9792835706</p>
        </div>

        {/* Navigation */}
        <div className="relative p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md ">
          <h4 className="text-xl font-semibold text-cyan-300 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {["Home", "Products", "Contact", "Login"].map((text, i) => (
              <li key={i} className="relative group">
                <Link to={text === "Home" ? "/" : `/${text.toLowerCase()}`} className="hover:text-cyan-400 transition-all duration-300">
                  {text}
                </Link>
                
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div className="relative p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md  ">
          <h4 className="text-xl font-semibold text-pink-400 mb-3">Follow Us</h4>
          <div className="flex gap-6 text-2xl">
            {[ {
              href: "https://linkedin.com/in/abhishek2113040/",
              icon: <FaLinkedin />,
              color: "text-blue-400"
            }, {
              href: "https://github.com/abhishekgupta706",
              icon: <FaGithub />,
              color: "text-white"
            }, {
              href: "https://wa.me/919792835706",
              icon: <FaWhatsapp />,
              color: "text-green-400"
            }].map(({ href, icon, color }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                className={`group relative  ${color}`}>
                {icon}
                
              </a>
            ))}
          </div>
        </div>

        {/* Farmer CTA */}
        <div className="relative p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-transform  duration-500">
          <h4 className="text-xl font-semibold text-green-400 mb-3">For Customer</h4>
          <p className="text-sm mb-4"> Join us at Foodie Ville to savor our dishes or order online for a delightful dining experience.</p>
          <button onClick={scrollToTop}
            className="group relative inline-flex items-center px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-full shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
            <FaArrowUp className="mr-2 group-hover:animate-bounce" />
            Back to Top
           
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="my-14 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20 rounded-full" />

      {/* Copyright */}
      <div className="text-center text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-white font-semibold">RESTRO</span>. All rights reserved.
      </div>

      {/* Developer Credits */}
      <div className="mt-3 text-center text-sm">
        <a href="https://www.linkedin.com/in/amangupta9454" target="_blank" rel="noopener noreferrer"
          className="text-cyan-300 hover:underline transition">
          Created by <span className="font-semibold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text ">Abhishek Gupta</span>
        </a>
      </div>

     
    </footer>
  );
};

export default Footer;