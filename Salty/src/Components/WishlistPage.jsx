import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useCartStore from "../Components/cartStore";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/wishlist");
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist", error);
      toast.error("Failed to load wishlist items");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${itemId}`);
      setWishlist(wishlist.filter((item) => item.product_id !== itemId));
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Error removing item", error);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.product_id,
      name: item.name,
      price: item.price,
      discount_price: item.discount_price || item.price,
      image: item.image,
      qty: 1
    });
    toast.success(`${item.name} added to cart!`);
  };

  const handleProductClick = (item) => {
    navigate(`/product/${item.product_id}`, { 
      state: { 
        product: {
          id: item.product_id,
          name: item.name,
          price: item.price,
          discount_price: item.discount_price,
          image: item.image
        }
      }
    });
  };

  // Helper function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="container mx-auto p-6 mt-20">
      <h2 className="text-3xl font-bold mb-8 text-center">My Wishlist</h2>
      {loading ? (
        <div className="text-center py-10">Loading wishlist items...</div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div 
              key={item.product_id} 
              className="border rounded-lg overflow-hidden shadow-lg bg-white flex flex-col relative hover:shadow-xl transition-shadow"
            >
              <div 
                className="cursor-pointer"
                onClick={() => handleProductClick(item)}
              >
                <img 
                  src={getImageUrl(item.image)} 
                  alt={item.name} 
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                  }}
                />
                <div className="p-4">
                  <h3 className="text-2xl font-bold">{item.name}</h3>
                  <div className="flex gap-2 items-center my-2">
                    {item.discount_price && item.discount_price !== item.price && (
                      <span className="text-gray-500 line-through text-sm">
                        ₹{parseFloat(item.price).toFixed(2)}
                      </span>
                    )}
                    <span className="text-xl font-bold">
                      ₹{parseFloat(item.discount_price || item.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 mt-auto">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-gradient-to-r from-[#7B3F00] to-[#C19A6B] text-white px-4 py-2 rounded flex-1 hover:opacity-90 transition"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="bg-[#7B3F00] text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;



