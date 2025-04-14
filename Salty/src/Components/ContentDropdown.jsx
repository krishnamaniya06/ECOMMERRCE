import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa"; 

const ContentDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sorting options
  const sortingOptions = [
    { label: "Alphabetically, A-Z", path: "alphabetical-a-z" },
    { label: "Alphabetically, Z-A", path: "alphabetical-z-a" },
    { label: "Price, low to high", path: "price-low-high" },
    { label: "Price, high to low", path: "price-high-low" },
  ];

  // Handle navigation when an option is clicked
  const handleSelect = (path) => {
  navigate(`/filter/${path}`);
  setDropdownOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        className="bg-white text-black border square-md px-10 py-2 flex items-center gap-2 shadow-md hover:shadow-lg transition"
        onClick={toggleDropdown}
      >
        Sort
        <FaChevronDown
          className={`transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {dropdownOpen && (
        <ul className="absolute left-0 mt-2 w-52 bg-white border square-md shadow-lg z-50 overflow-hidden">
          {sortingOptions.map((item) => (
            <Link to={`/filter/${item.path}`}>
            <li
              key={item.path}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition over"
              onClick={() => handleSelect(item.path)}
              >
              {item.label}
            </li>
              </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ContentDropdown;
