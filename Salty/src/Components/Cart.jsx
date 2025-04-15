import React, { useState, useEffect } from "react";
import useCartStore from "./cartStore";
import { useAuth } from "./AuthContext.jsx";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import axios from "axios";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateCartItem, checkout, loading, orderSuccess, error, resetOrderStatus } = useCartStore();
  const [customerId, setCustomerId] = useState('');
  const [localAuthState, setLocalAuthState] = useState({
    isAuthenticated: false,
    currentUser: null
  });
  
  // Get authentication context
  const authContext = useAuth();

  // Ensure authentication state is consistent, especially after page refresh
  useEffect(() => {
    const checkAuthState = async () => {
      // First, try to use the auth context
      if (authContext && authContext.isAuthenticated && authContext.currentUser) {
        setLocalAuthState({
          isAuthenticated: true,
          currentUser: authContext.currentUser
        });
        return;
      }

      // If auth context doesn't have the data, check localStorage and API
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Set authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify the token with the server
          const response = await axios.get('http://localhost:5000/api/user-profile');
          if (response.data && response.data.user) {
            setLocalAuthState({
              isAuthenticated: true,
              currentUser: response.data.user
            });
          }
        } catch (error) {
          console.error("Auth verification error:", error);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          setLocalAuthState({
            isAuthenticated: false,
            currentUser: null
          });
        }
      }
    };

    checkAuthState();
  }, [authContext]);

  // Use the combined auth state from both context and local check
  const isAuthenticated = authContext?.isAuthenticated || localAuthState.isAuthenticated;
  const currentUser = authContext?.currentUser || localAuthState.currentUser;

  console.log("Current cart state:", cart); // Debugging line
  console.log("Auth status:", isAuthenticated, currentUser); // Debugging line

  // Calculate total price for all items in the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.discount_price * item.qty, 0);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert("Please log in to complete your purchase.");
      return;
    }
    
    // If logged in, use the user's email as the customer ID
    const id = isAuthenticated && currentUser ? currentUser.email : customerId.trim();
    await checkout(id);
  };

  // Reset order status when component unmounts
  useEffect(() => {
    return () => {
      resetOrderStatus();
    };
  }, [resetOrderStatus]);

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-10">
        <h2 className="text-2xl font-bold mb-4 text-amber-800">Shopping Cart</h2>
        
        {isAuthenticated && currentUser && (
          <div className="bg-amber-100 border border-amber-400 text-amber-700 px-4 py-2 rounded mb-4">
            Logged in as: {currentUser.email}
          </div>
        )}
        
        {orderSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Order placed successfully! Thank you for your purchase.
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {cart.length === 0 && !orderSuccess ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="mb-4">Your cart is empty.</p>
            <Link to="/all-products" className="px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800">
              Continue Shopping
            </Link>
          </div>
        ) : (
          !orderSuccess && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 border-b border-amber-100">
                  <div className="flex items-center">
                    <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="ml-4">
                      <span className="font-semibold text-amber-800">{item.name}</span>
                      <p className="text-amber-600">₹{(Number(item.discount_price) || 0).toFixed(2)} x {item.qty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartItem(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md"
                    >
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => updateCartItem(item.id, item.qty + 1)}
                      className="px-2 py-1 bg-amber-100 text-amber-800 rounded-md"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 ml-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-6 border-t border-amber-200 pt-4">
                <h3 className="font-bold text-lg text-amber-800">Total: ₹{(getTotalPrice() || 0).toFixed(2)}</h3>
                
                {!isAuthenticated && (
                  <div className="mt-4 mb-2 bg-yellow-100 p-3 rounded border border-yellow-200 text-yellow-800">
                    <p>Please log in to complete your purchase.</p>
                    <Link to="/auth" className="underline text-amber-700 font-medium">
                      Go to login page
                    </Link>
                  </div>
                )}
                
                <div className="mt-4">
                  {!isAuthenticated && (
                    <div className="mb-4">
                      <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 mb-2">
                        Customer ID (optional for guest checkout)
                      </label>
                      <input
                        type="text"
                        id="customerId"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        placeholder="Enter your customer ID or email"
                        className="w-full px-3 py-2 border border-amber-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={clearCart}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Clear Cart
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={loading || cart.length === 0}
                    className={`px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : 'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Cart;





