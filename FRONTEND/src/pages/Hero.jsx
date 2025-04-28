import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import one from '../assets/hero1.jpg';
import two from '../assets/hero2.jpg';
import three from '../assets/hero3.jpg';
import four from '../assets/hero4.jpg';
import five from '../assets/hero5.jpg';
import matarpaneer from '../assets/matarpaneer.jpg';
import paneerrice from '../assets/paneerrice.jpg';
import paneertikka from '../assets/paneertikka.jpg';
import idli from '../assets/idli.jpg';
import masaladosa from '../assets/masaladosa.jpg';
import chhole from '../assets/chole.jpg';
import masterchef from '../assets/Masterchef.jpg';
import reserve from '../assets/table.jpg';
import menus from '../assets/Menus.jpg';
import live_cooking_station from '../assets/live-cooking-station.jpg';
import ingredients from '../assets/ingrediant.jpg';
import cookshop from '../assets/Cookworkshop.jpg';
import { FaUtensils, FaBook, FaChair, FaFire, FaCarrot, FaShoppingBasket } from 'react-icons/fa';

const FeatureCard = ({ img, title, description, icon }) => {
  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden transform duration-500 hover:scale-105 hover:shadow-2xl group">
      <div className="relative">
        <img src={img} alt={title} className="w-full h-60 object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-green-500 text-3xl">{icon}</div>
          <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>
    </div>
  );
};

const ProductCard = ({ img, name, description }) => {
  return (
    <div className="bg-gray-200 shadow-lg rounded-xl overflow-hidden group m-2 sm:m-4 border border-green-100">
      <div className="relative">
        <img src={img} alt={name} className="w-full h-48 sm:h-60 object-cover" />
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm sm:text-base mb-4">{description}</p>
      </div>
    </div>
  );
};

const Hero = () => {
  const [showFeatures, setShowFeatures] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const featuresRef = useRef(null);
  const productsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowFeatures(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowProducts(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (productsRef.current) {
      observer.observe(productsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full min-h-screen md:min-h-[30vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={4000}
            transitionTime={500}
            stopOnHover={false}
            swipeable
            emulateTouch
            showArrows={false}
          >
            {[one, two, three, four, five].map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-screen object-cover"
                />
              </div>
            ))}
          </Carousel>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 py-36">
          <div className="bg-gray-600/50 backdrop-blur-lg p-8 md:p-12 rounded-xl max-w-3xl">
            <h1 className="text-5xl font-semibold text-clip hover:text-blue-900 text-black mb-6">
              Foodie Ville – Eat. Laugh. Repeat.
            </h1>
            <p className="text-black text-lg md:text-2xl mb-6">
              Bold flavors. Elevated dining experience.
            </p>
          </div>
        </div>
      </section>

      {/* Our Facilities Section */}
      <section
        ref={featuresRef}
        className={`py-20 bg-cover bg-center relative transition-opacity duration-1000 ${
          showFeatures ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${one})`, backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 text-center mb-12">
          <h2 className="text-4xl font-bold text-white drop-shadow-md">Our Facilities</h2>
          <p className="text-lg text-gray-200 mt-4 max-w-3xl mx-auto">
            Discover the exceptional facilities that make Foodie Ville a unique dining destination.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
          {[
            {
              img: masterchef,
              title: 'Master Chefs',
              description: 'Our expert chefs create culinary masterpieces with passion and precision.',
              icon: <FaUtensils />,
            },
            {
              img: reserve,
              title: 'Seamless Reservations',
              description: 'Easily book your table online for a hassle-free dining experience.',
              icon: <FaChair />,
            },
            {
              img: menus,
              title: 'Diverse Menus',
              description: 'Explore a variety of curated menus catering to all tastes and preferences.',
              icon: <FaBook />,
            },
            {
              img: live_cooking_station,
              title: 'Live Cooking Stations',
              description: 'Enjoy the excitement of watching your meal prepared fresh in real-time.',
              icon: <FaFire />,
            },
            {
              img: ingredients,
              title: 'Fresh Ingredients',
              description: 'We use only the freshest, high-quality ingredients in every dish.',
              icon: <FaCarrot />,
            },
            {
              img: cookshop,
              title: 'Cooking Workshops',
              description: 'Join our workshops to learn cooking techniques from our expert chefs.',
              icon: <FaShoppingBasket />,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ease-out ${
                showFeatures ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </section>

      {/* Our Products Section */}
      <section
        ref={productsRef}
        className={`py-16 sm:py-20 bg-cover bg-center relative transition-opacity duration-1000 ${
          showProducts ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundImage: `url(${one})`, backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-10 text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">Our Signature Dishes</h2>
          <p className="text-base sm:text-lg text-gray-200 mt-4 max-w-3xl mx-auto">
            Savor our carefully crafted dishes, made with love and the finest ingredients.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
          {[
            {
              img: matarpaneer,
              name: 'Matar Paneer',
              description: 'Creamy curry with tender paneer and green peas in a rich tomato sauce.',
            },
            {
              img: paneerrice,
              name: 'Paneer Fried Rice',
              description: 'Aromatic rice stir-fried with paneer and fresh vegetables, packed with flavor.',
            },
            {
              img: paneertikka,
              name: 'Paneer Tikka',
              description: 'Marinated paneer cubes grilled to perfection with a smoky, spicy kick.',
            },
            {
              img: idli,
              name: 'Soft Idli',
              description: 'Fluffy steamed rice cakes served with coconut chutney and sambar.',
            },
            {
              img: masaladosa,
              name: 'Masala Dosa',
              description: 'Crispy rice crepe filled with spiced potato filling, served with chutney.',
            },
            {
              img: chhole,
              name: 'Chhole Bhature',
              description: 'Spicy chickpea curry paired with fluffy, deep-fried bread.',
            },
          ].map((product, index) => (
            <div
              key={index}
              className={`transform transition-all duration-700 ease-out ${
                showProducts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
        {/* Enhanced Collaboration Section */}
        <section className="relative overflow-hidden rounded-[40px] mx-auto mt-16 w-full max-w-6xl px-8 py-14 transition-transform duration-500 hover:scale-[1.02] group shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-600/50 to-gray-600/50 backdrop-blur-[12px] border border-white/20 rounded-[40px] z-0" />
          <div className="absolute inset-0 bg-stars-pattern bg-cover opacity-10 z-0 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8">
            <div className="text-center lg:text-left flex-1 animate-slide-in-left">
              <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">
                Ready to Savor?
              </h2>
              <p className="text-lg text-gray-300 max-w-xl">
                Join us at Foodie Ville or order online to experience culinary delight. Let’s eat together!
              </p>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              <a
                href="tel:+919560472926"
                className="relative inline-block px-8 py-4 bg-cyan-500 text-white font-bold rounded-full ring-2 ring-transparent hover:ring-cyan-300"
              >
                <span className="relative z-10">📞 Connect Now</span>
              </a>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Hero;