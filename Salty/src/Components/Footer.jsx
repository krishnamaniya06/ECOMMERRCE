import { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedin } from "react-icons/fa";
import axios from "axios";

const Footer = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [message, setMessage] = useState(""); // State for success/error messages

  // Subscription handler function
  const handleSubscribe = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    try {
      const response = await axios.post("http://localhost:5000/subscribe", { email });
      setMessage(response.data.message || "Subscription successful!"); // Display success message
      setEmail(""); // Clear email input field
    } catch (error) {
      setMessage("Error sending email. Please try again."); // Display error message
    }
  };

  return (
    <footer className="bg-[#C4A484] text-gray-800 py-10 text-sm">
      <div className="max-w-6xl mx-auto px-5">
        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-300 pb-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">All Jewellery</h2>
            <ul className="space-y-2">
              <li><Link to="/products/type/earrings">Earrings</Link></li>
              <li><Link to="/products/type/rings">Rings</Link></li>
              <li><Link to="/products/type/necklaces">Necklaces</Link></li>
              <li><Link to="/products/type/bracelets">Bracelets</Link></li>
              <li><Link to="/products/type/gift box">Gift Box</Link></li>
              <li><Link to="/products/new-arrivals">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Reviews and Deals</h2>
            <ul className="space-y-2">
              <li><a href="#">Offers and Deals</a></li>
              <li><a href="#">Happy Customers Gallery</a></li>
              <li><a href="#">Customer Reviews</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Join Our Community</h2>
            <ul className="space-y-2">
              <li><a href="#">Affiliate Program</a></li>
              <li><a href="#">Fashion Blog</a></li>
              <li><a href="#">Just for Fun</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-6 border-b border-gray-300 pb-6">
          <h2 className="text-lg font-semibold mb-3">Sign Up and Save</h2>
          <form onSubmit={handleSubscribe} className="mt-3 flex items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-3 py-2 w-full max-w-sm border rounded-l-md focus:outline-none focus:ring focus:ring-gray-400"
              required
            />
            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-r-md">
              Subscribe
            </button>
          </form>
          {message && (
            <p className={`mt-3 ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}>
              {message}
            </p>
          )}
        </div>

        {/* Policies & Links */}
        <div className="mt-6 text-gray-600 text-sm">
          <ul className="flex flex-wrap gap-4 justify-center">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Refund Policy</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Track Order</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mt-6">
          <a href="#"><FaInstagram size={24} /></a>
          <a href="#"><FaFacebookF size={24} /></a>
          <a href="#"><FaTwitter size={24} /></a>
          <a href="#"><FaLinkedin size={24} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;