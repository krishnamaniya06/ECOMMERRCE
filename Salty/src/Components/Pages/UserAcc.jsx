import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import Navbar from "../Navbar.jsx";
import axios from "axios";
import { ChevronDown, ChevronUp, Package, ShoppingBag, Clock, Check, AlertCircle } from "lucide-react";

const UserAcc = () => {
  const navigate = useNavigate();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    // Fetch detailed order history
    const fetchOrderHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        // Ensure token exists
        if (!token) {
          console.error("No auth token found");
          setError("Authentication error. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/order-history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Order history API response:", response.data);
        
        // Check if response data is valid
        if (!response.data) {
          setError("Received empty response from server");
          setOrderHistory([]);
        } else {
          setOrderHistory(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
        setError(
          error.response?.data?.message || 
          "Failed to load order history. Please try again later."
        );
        setOrderHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString || "N/A";
    }
  };

  // Get status icon based on order status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'shipped':
        return <Package className="h-4 w-4 text-purple-600" />;
      default:
        return <ShoppingBag className="h-4 w-4 text-amber-600" />;
    }
  };

  // Get safe image URL with fallback
  const getSafeImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/64?text=No+Image';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    return `http://localhost:5000${imagePath}`;
  };

  const retryFetchOrders = () => {
    setLoading(true);
    setError(null);
    
    // Refetch after a small delay
    setTimeout(() => {
      const fetchOrderHistory = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5000/api/order-history', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setOrderHistory(response.data || []);
        } catch (error) {
          console.error("Error retrying order history fetch:", error);
          setError(
            error.response?.data?.message || 
            "Failed to load order history. Please try again later."
          );
          setOrderHistory([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchOrderHistory();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-10">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-serif text-amber-800">My Account</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-amber-100 rounded-md">
            <h2 className="font-semibold text-amber-800 mb-2">Account Information</h2>
            <p><span className="font-medium">Email:</span> {currentUser?.email}</p>
            <p><span className="font-medium">Role:</span> {currentUser?.role || 'Customer'}</p>
          </div>
          
          <div>
            <h2 className="font-semibold text-amber-800 mb-4">Order History</h2>
            
            {/* Error state with retry button */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="text-red-700">{error}</p>
                  <button 
                    onClick={retryFetchOrders}
                    className="mt-2 text-sm px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-700 border-r-transparent"></div>
                <p className="mt-2 text-amber-700">Loading your order history...</p>
              </div>
            ) : !error && orderHistory.length > 0 ? (
              <div className="space-y-4">
                {orderHistory.map((order) => (
                  <div key={order.id || `order-${Math.random()}`} className="border border-amber-200 rounded-lg overflow-hidden">
                    {/* Order Header */}
                    <div 
                      className="p-4 bg-amber-50 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleOrderExpand(order.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-amber-100 rounded-full">
                          <ShoppingBag className="h-5 w-5 text-amber-700" />
                        </div>
                        <div>
                          <p className="font-medium text-amber-900">Order #{order.id || "Unknown"}</p>
                          <p className="text-sm text-amber-600">{formatDate(order.order_date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(order.status)}
                          <span className={`text-sm ${
                            order.status === 'completed' ? 'text-green-700' :
                            order.status === 'processing' ? 'text-blue-700' :
                            'text-amber-700'
                          }`}>
                            {order.status || 'Processing'}
                          </span>
                        </div>
                        <div className="text-amber-900 font-medium">₹{order.total_amount || 0}</div>
                        {expandedOrders[order.id] ? 
                          <ChevronUp className="h-5 w-5 text-amber-700" /> : 
                          <ChevronDown className="h-5 w-5 text-amber-700" />
                        }
                      </div>
                    </div>
                    
                    {/* Order Details (expandable) */}
                    {expandedOrders[order.id] && (
                      <div className="p-4 bg-white border-t border-amber-100">
                        <h3 className="font-medium text-amber-800 mb-2">Order Items</h3>
                        
                        <div className="space-y-3">
                          {order.items && order.items.length > 0 ? (
                            order.items.map(item => (
                              <div key={item.id || `item-${Math.random()}`} className="flex items-center p-2 hover:bg-amber-50 rounded-md">
                                <div className="h-16 w-16 min-w-[4rem] bg-gray-100 rounded-md overflow-hidden mr-3">
                                  <img 
                                    src={getSafeImageUrl(item.image)} 
                                    alt={item.name || "Product"}
                                    className="h-full w-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64?text=No+Image'; }}
                                  />
                                </div>
                                <div className="flex-grow">
                                  <p className="font-medium text-amber-900">{item.name || "Unknown Product"}</p>
                                  <div className="flex justify-between text-sm text-amber-600">
                                    <p>Qty: {item.quantity || 0}</p>
                                    <p>Price: ₹{item.price || 0}</p>
                                  </div>
                                </div>
                                <div className="text-amber-900 font-medium ml-4">
                                  ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-amber-600 italic">No item details available</p>
                          )}
                        </div>
                        
                        <div className="mt-4 border-t border-amber-100 pt-3 flex justify-between">
                          <div className="text-sm text-amber-700">
                            <p>Order Date: {formatDate(order.order_date)}</p>
                            <p>Customer ID: {order.customer_id || "Unknown"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-amber-700">Order Total</p>
                            <p className="text-lg font-bold text-amber-900">₹{order.total_amount || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-amber-50 rounded-lg">
                <ShoppingBag className="h-12 w-12 text-amber-400 mx-auto mb-2" />
                <p className="text-amber-800 font-medium">You haven't placed any orders yet.</p>
                <button 
                  onClick={() => navigate('/all-products')}
                  className="mt-3 px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAcc; 