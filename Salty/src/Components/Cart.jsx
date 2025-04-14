import React, { useState } from "react";
import useCartStore from "../Components/cartStore";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateCartItem, checkout, loading, orderSuccess, error, resetOrderStatus } = useCartStore();
  const [customerId, setCustomerId] = useState('');

  console.log("Current cart state:", cart); // Debugging line

  // Calculate total price for all items in the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.discount_price * item.qty, 0);
  };

  const handleCheckout = async () => {
    // Use the customer ID from input or default to 'guest'
    const id = customerId.trim() || 'guest';
    await checkout(id);
  };

  // Reset order status when component unmounts
  React.useEffect(() => {
    return () => {
      resetOrderStatus();
    };
  }, [resetOrderStatus]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      
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
        <p>Your cart is empty.</p>
      ) : (
        !orderSuccess && (
          <div>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-2 border-b">
                <div className="flex items-center">
                  <img src={`http://localhost:5000${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <span className="font-semibold ml-4">{item.name}</span> - ₹{(Number(item.discount_price) || 0).toFixed(2)} x {item.qty}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateCartItem(item.id, item.qty - 1)}
                    disabled={item.qty <= 1}
                    className="px-2 py-1 bg-gray-200 rounded-md"
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button
                    onClick={() => updateCartItem(item.id, item.qty + 1)}
                    className="px-2 py-1 bg-gray-200 rounded-md"
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
            <div className="mt-4">
              <h3 className="font-bold text-lg">Total: ₹{(getTotalPrice() || 0).toFixed(2)}</h3>
              
              <div className="mt-4">
                <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
                  Customer ID (optional)
                </label>
                <input
                  type="text"
                  id="customerId"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter your customer ID or leave blank"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Clear Cart
                </button>
                
                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Cart;





