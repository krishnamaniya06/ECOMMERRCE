import React, { useState, useRef, useEffect } from 'react';
import DropdownMenu from './DropdownMenu';
import allEarringsImage from '../assets/all-earrings.jpg';
import comboEarringsImage from '../assets/combo-earrings.jpg';
import antiTarnishEarringsImage from '../assets/anti-tarnish-earrings.jpg';
import allRingsImage from '../assets/all-rings.jpg';
import allNecklacesImage from '../assets/all-necklaces.jpg';
import antiTarnishNecklacesImage from '../assets/anti-tarnish-necklaces.jpg';
import allBraceletsImage from '../assets/all-bracelets.jpg';
import { Heart, User, ShoppingCart, X, Home } from 'lucide-react';
import Tooltip from '@mui/material/Tooltip';
import useCartStore from './cartStore';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; 
import { useAuth } from "./AuthContext.jsx";

const Navbar = () => {
  const { cart } = useCartStore(); 
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef(null);
  const recommendationsRef = useRef(null);
  const [wishlist, setWishlist] = useState([]);
  const [addedProducts, setAddedProducts] = useState(0);

  // Add auth context
  const auth = useAuth() || { currentUser: null, isAuthenticated: false };
  const { isAuthenticated } = auth;

  // Fetch wishlist data
  useEffect(() => {
    axios.get("http://localhost:5000/api/wishlist")
      .then(response => {
        setWishlist(response.data);
        // Count the number of products that have been added
        setAddedProducts(response.data.length);
      })
      .catch(error => console.error("Error fetching wishlist:", error));
  }, []);

  // Search recommendations categories
  const recommendations = [
    { label: 'Rings', href: '/products/type/rings' },
    { label: 'Earrings', href: '/products/type/earrings' },
    { label: 'Necklaces', href: '/products/type/necklaces' },
    { label: 'Bracelets', href: '/products/type/bracelets' },
    { label: 'Jewelry Sets', href: '/products/type/jewelry sets' },
    { label: 'Anti-tarnish Earrings', href: '/products/type/anti-tarnish earrings' },
    { label: 'Anti-tarnish Necklaces', href: '/products/type/anti-tarnish necklaces' },
    { label: 'Gift Boxes', href: '/products/type/gift box' },
  ];

  // Close recommendation dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        recommendationsRef.current && 
        !recommendationsRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowRecommendations(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus on search input when search bar appears
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Handle Escape key to close search overlay
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showSearch) {
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showSearch]);

  const handleSearchIconClick = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setShowRecommendations(false);
      setSearchValue('');
    }
  };

  const handleHomeIconClick = () => {
    navigate('/');
  };

  const handleSearchInputClick = () => {
    setShowRecommendations(true);
  };

  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleRecommendationClick = (href) => {
    navigate(href);
    setShowSearch(false);
    setShowRecommendations(false);
    setSearchValue('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
      setShowSearch(false);
      setShowRecommendations(false);
    }
  };

  const handleWishlistClick = () => {
    navigate('/wishlist');
  };

  const menuItems = [
    { 
      label: 'ALL JEWELLERY',
      href: '/all-products',
      isBoxStyle: true // Flag for box styling
    },
    {
      label: 'EARRINGS',
      dropdownItems: [
        {
          label: 'All Earrings',
          href: '/products/type/earrings',
          image: allEarringsImage,
        },
        {
          label: 'Combo Earrings',
          href: '/products/type/set of earrings', 
          image: comboEarringsImage,
        },
        {
          label: 'Anti-tarnish Earrings',
          href: '/products/type/anti-tarnish earrings',
          image: antiTarnishEarringsImage,
        },
      ],
    },
    {
      label: 'RINGS',
      dropdownItems: [
        {
          label: 'All Rings',
          href: '/products/type/rings',
          image: allRingsImage,
        },
      ],
    },
    {
      label: 'NECKLACES',
      dropdownItems: [
        {
          label: 'All Necklaces',
          href: '/products/type/necklaces',
          image: allNecklacesImage,
        },
        {
          label: 'Anti-tarnish Necklaces',
          href: '/products/type/anti-tarnish necklaces',
          image: antiTarnishNecklacesImage,
        },
      ],
    },
    {
      label: 'BRACELETS',
      dropdownItems: [
        {
          label: 'All Bracelets',
          href: '/products/type/bracelets',
          image: allBraceletsImage,
        },
      ],
    },
    { 
      label: 'GIFT BOXES',
      href: '/products/type/gift box',
      isBoxStyle: true // Flag for box styling
    },
    { 
      label: 'NEW ARRIVALS',
      href: '/products/new-arrivals',
      isBoxStyle: true // Flag for box styling
    },
  ];

  // Custom handler for menu items without dropdown
  const handleMenuItemClick = (item) => {
    if (item.href) {
      navigate(item.href);
    }
  };

  // Handle gender category selection
  const handleGenderClick = (gender) => {
    try {
      // Navigate to the gender-specific products page
      navigate(`/products/gender/${gender.toLowerCase()}`);
    } catch (error) {
      console.error(`Error loading ${gender}'s category:`, error);
    }
  };

  // Filter recommendations based on search input
  const filteredRecommendations = searchValue
    ? recommendations.filter(item => 
        item.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    : recommendations;

  return (
    <>
      {/* Search overlay with white background */}
      {showSearch && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-50 pt-4">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between mb-8">
              <div className="text-2xl font-bold text-[#4B3621]">
                Search Jewelry
              </div>
              <button 
                onClick={() => setShowSearch(false)}
                className="text-[#4B3621] hover:text-[#C2A080] transition"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <div className="relative max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for jewelry..."
                  className="w-full py-4 px-6 pr-12 rounded-lg border-2 border-[#C2A080] focus:outline-none focus:border-[#4B3621] text-lg"
                  value={searchValue}
                  onChange={handleSearchInputChange}
                  onClick={handleSearchInputClick}
                />
                <button 
                  type="submit" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-[#6F4E37]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </button>
              </form>
              
              {/* Recommendations dropdown */}
              {showRecommendations && (
                <div 
                  ref={recommendationsRef}
                  className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto border border-gray-200"
                >
                  <div className="p-3 text-base font-semibold text-[#4B3621] border-b bg-gray-50 rounded-t-lg">
                    Recommended Categories
                  </div>
                  {filteredRecommendations.length > 0 ? (
                    <ul>
                      {filteredRecommendations.map((item, index) => (
                        <li 
                          key={index}
                          className="px-6 py-3 hover:bg-gray-50 cursor-pointer text-gray-800 border-b border-gray-100 last:border-none transition duration-150"
                          onClick={() => handleRecommendationClick(item.href)}
                        >
                          {item.label}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-6 py-4 text-gray-500 text-center">No matching categories found</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Normal Navbar - hidden when search is active */}
      {!showSearch && (
        <nav className="bg-gradient-to-r from-[#4B3621] via-[#6F4E37] to-[#C2A080] shadow-md fixed top-0 left-0 w-full z-40">
          <div className="container mx-auto px-6 py-3 flex items-center justify-between relative">
            {/* Left Side */}
            
            <div className="flex items-center space-x-4">
              {/* Home Icon */}
              <Tooltip title="Home" arrow>
                <button 
                  className="text-white text-2xl font-bold"
                  onClick={handleHomeIconClick}
                  aria-label="Navigate to home"
                >
                  <Home className="w-6 h-6" />
                </button>
              </Tooltip>
              {/* Search Icon */}
              <button 
                className="text-white text-2xl font-bold"
                onClick={handleSearchIconClick}
                aria-label="Toggle search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </button>
            </div>

            {/* Centered "JEWELS" Heading */}
            <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-bold text-white uppercase mb-2">
              JEWELS
            </div>
            
            {/* Right Side */}
            <div className="flex items-center space-x-6">
              {/* Wishlist Icon with Tooltip and counter for added products */}
              <Tooltip title="Wishlist" arrow>
                <div 
                  className="relative text-white text-2xl cursor-pointer" 
                  onClick={handleWishlistClick}
                >
                  <Heart />
                  {addedProducts > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {addedProducts}
                    </span>
                  )}
                </div>
              </Tooltip>
              {/* User Icon with Tooltip for Login */}
              <Tooltip title="Account" arrow>
                <Link to={isAuthenticated ? "/useracc" : "/auth"} className="text-white text-2xl">
                  <User />
                </Link>
              </Tooltip>
              {/* Cart Button */}
              <Tooltip title="Cart" arrow>
                <div className="relative text-white text-2xl">
                  <Link to="/cart" className="text-white text-2xl">
                    <ShoppingCart />
                  </Link>
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.reduce((total, item) => total + item.qty, 0)}
                    </span>
                  )}
                </div>
              </Tooltip>
            </div>
          </div>
          {/* Menu Items */}
          <div className="hidden md:flex flex-col items-center">
            {/* First Row */}
            <div className="flex space-x-6">
              {menuItems.map((item, index) => {
                // For menu items with box styling, create a button with the same styling as gender buttons
                if (item.isBoxStyle) {
                  return (
                    <button 
                      key={index}
                      onClick={() => handleMenuItemClick(item)}
                      className="text-white text-lg font-semibold px-3 py-1 hover:bg-white hover:text-red-500 rounded-md transition"
                    >
                      {item.label}
                    </button>
                  );
                }
                // For menu items without dropdown and not box style, create a simple clickable button
                else if (!item.dropdownItems) {
                  return (
                    <button 
                      key={index}
                      onClick={() => handleMenuItemClick(item)}
                      className="text-white text-lg font-semibold px-2 py-1 hover:bg-blend-lighten hover:text-red-500 rounded-md transition"
                    >
                      {item.label}
                    </button>
                  );
                }
                // For items with dropdown, use the DropdownMenu component
                return (
                  <DropdownMenu
                    key={index}
                    label={item.label}
                    items={item.dropdownItems}
                  />
                );
              })}
            </div>
            {/* Second Row */}
            <div className="flex mt-2 space-x-6 mb-2">
              <button 
                className="text-white text-lg font-semibold px-3 py-1 hover:bg-white hover:text-red-500 rounded-md transition"
                onClick={() => handleGenderClick('MEN')}
              >
                MEN
              </button>
              <span className="text-white text-lg font-semibold">|</span>
              {/* Separator */}
              <button 
                className="text-white text-lg font-semibold px-3 py-1 hover:bg-white hover:text-red-500 rounded-md transition"
                onClick={() => handleGenderClick('WOMEN')}
              >
                WOMEN
              </button>
            </div>
          </div>
          <ToastContainer /> {/* Add ToastContainer for notifications */}
        </nav>
      )}
    </>
  );
};

export default Navbar;