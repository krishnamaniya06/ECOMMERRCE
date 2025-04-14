import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DropdownMenu = ({ label, items, href }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle mouse events for dropdown
  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  // If this menu item has a direct href (like ALL JEWELLERY)
  if (href && !items) {
    return (
      <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Link to={href} className="text-white text-lg font-semibold hover:bg-white hover:text-red-500 px-4 py-2 rounded-md transition">
          {label}
        </Link>
      </div>
    );
  }

  // Regular dropdown menu
  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="text-white text-lg font-semibold hover:bg-white hover:text-red-500 px-4 py-2 rounded-md transition">
        {label}
      </button>
      {/* Dropdown Content */}
      {isOpen && items && items.length > 0 && (
        <div className="absolute left-0  bg-white shadow-lg rounded-md py-2 w-56 z-50">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-10 h-10 object-cover rounded mr-2"
                />
              )}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;