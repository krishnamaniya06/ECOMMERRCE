import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Added useNavigate import
import useCartStore from '../cartStore';
import Navbar from '../Navbar';
import { toast } from 'react-toastify';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

const AntiTarnishNecklaces = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCartStore();
  const [wishlist, setWishlist] = useState(new Set());
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchAntiTarnishNecklaces = async () => {
      try {
        setLoading(true);
        console.log('Fetching Sets of Earrings products from: http://localhost:5000/api/products/type/anti-tarnish necklaces');
        // Fetch only Set of Earrings products
        const response = await axios.get('http://localhost:5000/api/products/type/anti-tarnish necklaces');
        console.log('Anti Tarnish Earrings products received:', response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Sets of Earrings products:', err);
        setError('Failed to load Anti Tarnish Earrings products. Please try again later.');
        setLoading(false);
      }
    };

    fetchAntiTarnishNecklaces();
  }, []);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/wishlist');
        setWishlist(new Set(response.data.map(item => item.product_id)));
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    fetchWishlist();
  }, []);

  const handleAddToCart = (product, event) => {
    // Prevent event propagation to avoid navigating to product details
    event.stopPropagation();
    
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      discount_price: product.discount_price || product.price,
      image: product.image,
      qty: 1
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = async (product, event) => {
    // Prevent event propagation to avoid navigating to product details
    event.stopPropagation();
    
    const productId = product._id || product.id;
    const updatedWishlist = new Set(wishlist);

    try {
      if (wishlist.has(productId)) {
        // Remove from wishlist
        await axios.delete(`http://localhost:5000/api/wishlist/${productId}`);
        updatedWishlist.delete(productId);
        toast.warn(`${product.name} removed from wishlist!`);
      } else {
        // Add to wishlist
        await axios.post('http://localhost:5000/api/wishlist', { 
          product_id: productId, 
          name: product.name, 
          price: product.price, 
          image: product.image.startsWith('http') ? product.image : `http://localhost:5000${product.image}`
        });
        updatedWishlist.add(productId);
        toast.info(`${product.name} added to wishlist!`);
      }
      setWishlist(updatedWishlist);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error(`Failed to ${wishlist.has(productId) ? 'remove from' : 'add to'} wishlist`);
    }
  };

  // Add function to navigate to product details
  const navigateToProductDetails = (product) => {
    navigate(`/product/${product._id || product.id}`, { 
      state: { product } 
    });
  };

  // Helper function to format price safely
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numPrice)) {
      return price;
    }
    
    return numPrice.toFixed(2);
  };

  // Helper function to construct proper image URL
  const getImageUrl = (imagePath) => {
    console.log('Original image path:', imagePath);
    
    if (!imagePath) {
      return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) return <div className="container mx-auto mt-32 text-center">Loading Anti Tarnish Necklaces products...</div>;
  if (error) return <div className="container mx-auto mt-32 text-center text-red-500">{error}</div>;
  if (products.length === 0) return <div className="container mx-auto mt-32 text-center">No Anti Tarnish Nacklaces products found.</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-4 mt-10">
        <h1 className="text-3xl font-bold mb-8 text-center mt-30">Anti Tarnish Necklaces Collection</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isWishlisted = wishlist.has(product._id || product.id);
            const displayPrice = product.discount_price || product.price;
            const originalPrice = product.price;

            return (
              <div 
                key={product._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => navigateToProductDetails(product)}
              >
                <div className="relative w-full h-80">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('Image load error for:', product.name);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                    }}
                  />
                  {/* Heart Icon for Wishlist */}
                  <button
                    onClick={(e) => handleToggleWishlist(product, e)}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 transition"
                  >
                    {isWishlisted ? (
                      <FaHeart className="text-red-500 text-2xl" />
                    ) : (
                      <FaRegHeart className="text-gray-500 text-2xl hover:text-red-500" />
                    )}
                  </button>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      {product.discount_price && (
                        <span className="text-gray-500 line-through text-sm">
                          ₹{formatPrice(originalPrice)}
                        </span>
                      )}
                      <span className="text-xl font-bold">₹{formatPrice(displayPrice)}</span>
                    </div>
                    <button 
                      onClick={(e) => handleAddToCart(product, e)}
                      className="bg-gradient-to-r from-[#7B3F00] to-[#C19A6B] text-white px-4 py-2 rounded hover:opacity-90 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AntiTarnishNecklaces;