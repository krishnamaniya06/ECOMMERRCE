import { create } from "zustand";

// Function to get stored cart data with expiration check
const getStoredCart = () => {
  try {
    const data = JSON.parse(localStorage.getItem("cartData"));
    if (!data) return [];

    const now = new Date().getTime();
    if (now > data.expiration) {
      localStorage.removeItem("cartData"); // Clear expired cart
      return [];
    }
    return data.cart;
  } catch (error) {
    console.error("Error loading cart from storage:", error);
    localStorage.removeItem("cartData"); // Clear invalid cart data
    return [];
  }
};

// Function to save cart with expiration (2 days)
const saveCartToStorage = (cart) => {
  try {
    const expiration = new Date().getTime() + 2 * 24 * 60 * 60 * 1000; // 2 days
    localStorage.setItem("cartData", JSON.stringify({ cart, expiration }));
  } catch (error) {
    console.error("Error saving cart to storage:", error);
  }
};

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Returns true if token exists
};

const useCartStore = create((set, get) => ({
  cart: getStoredCart(), // Load cart from storage
  loading: false,
  error: null,
  orderSuccess: false,
  lastOrderId: null, // Track the last successful order ID
  redirectAfterLogin: false, // Flag to redirect back to checkout after login

  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      let updatedCart;

      if (existingItem) {
        updatedCart = state.cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        updatedCart = [
          ...state.cart,
          { 
            ...product, 
            qty: 1, 
            price: Number(product.price) || 0,  // Ensure price is a number
            discount_price: Number(product.discount_price) || Number(product.price) || 0, // Ensure discount_price is a number
            image: product.image // Store product image
          }
        ];
      }

      saveCartToStorage(updatedCart);
      return { cart: updatedCart };
    }),

  // Update item quantity
  updateCartItem: (id, qty) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
      );
      saveCartToStorage(updatedCart);
      return { cart: updatedCart };
    }),

  removeFromCart: (id) =>
    set((state) => {
      const updatedCart = state.cart.filter((item) => item.id !== id);
      saveCartToStorage(updatedCart);
      return { cart: updatedCart };
    }),

  clearCart: () => {
    localStorage.removeItem("cartData"); // Remove from storage
    set({ cart: [] });
  },
  
  // Calculate total price
  getTotalPrice: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      const price = Number(item.discount_price) || Number(item.price) || 0;
      return total + price * item.qty;
    }, 0);
  },
  
  // Set redirect flag
  setRedirectAfterLogin: (value) => set({ redirectAfterLogin: value }),
  
  // Checkout function to place order
  checkout: async (customerId) => {
    const { cart, getTotalPrice } = get();
    
    if (!cart.length) {
      set({ error: "Your cart is empty" });
      return null;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      set({ error: "Please log in to complete your purchase." });
      return null;
    }
    
    set({ loading: true, error: null, orderSuccess: false, lastOrderId: null });
    
    try {
      // Get token for authorization
      const token = localStorage.getItem('token');
      
      // Prepare the order data with proper number conversions
      const orderData = {
        customerId: customerId || 'guest', // Use guest if customer ID not provided
        items: cart.map(item => ({
          ...item,
          price: Number(item.price) || 0,
          discount_price: Number(item.discount_price) || Number(item.price) || 0,
          qty: Number(item.qty) || 1
        })),
        totalAmount: getTotalPrice(),
        orderDate: new Date().toISOString()
      };
      
      console.log("Sending order data:", orderData);
      
      // Send the order to the backend with authentication
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(orderData)
      });
      
      // Parse the response
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to place order');
      }
      
      console.log("Order success:", result);
      
      // Clear cart after successful order
      localStorage.removeItem("cartData");
      set({ 
        cart: [], 
        loading: false, 
        orderSuccess: true,
        lastOrderId: result.orderId
      });
      
      return result;
      
    } catch (error) {
      console.error('Checkout error:', error);
      set({ 
        loading: false, 
        error: error.message || 'Failed to place order' 
      });
      return null;
    }
  },
  
  // Reset order status
  resetOrderStatus: () => {
    set({ orderSuccess: false, error: null });
  },
  
  // Get order details by ID
  getOrderDetails: async (orderId) => {
    set({ loading: true, error: null });
    
    try {
      // Get auth token
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include authorization header
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      
      const data = await response.json();
      set({ loading: false });
      return data;
      
    } catch (error) {
      console.error('Error fetching order details:', error);
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch order details'
      });
      return null;
    }
  },
  
  // Get order history for a customer
  getCustomerOrders: async (customerId) => {
    if (!customerId) return null;
    
    set({ loading: true, error: null });
    
    try {
      // Get auth token
      const token = localStorage.getItem("token");
      
      const response = await fetch(`http://localhost:5000/api/orders/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Include authorization header
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
      
      const data = await response.json();
      set({ loading: false });
      return data;
      
    } catch (error) {
      console.error('Error fetching order history:', error);
      set({ 
        loading: false, 
        error: error.message || 'Failed to fetch order history'
      });
      return null;
    }
  }
}));

export default useCartStore;