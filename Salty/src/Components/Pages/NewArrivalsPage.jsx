import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useCartStore from '../cartStore';
import Navbar from '../Navbar';
import { toast } from 'react-toastify';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const { addToCart } = useCartStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Get today's date and the date 30 days ago
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30); // Set to 30 days before today
        
        // Fetch all products
        const response = await axios.get('http://localhost:5000/api/products/all');
        
        // Filter products by date
        const filteredProducts = response.data.filter(product => {
          const productDate = new Date(product.date);
          return productDate >= thirtyDaysAgo && productDate <= today;
        });
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
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

  // Function to navigate to product detail page
  const handleProductClick = (product) => {
    const productId = product._id || product.id;
    // Pass product as state
    navigate(`/product/${productId}`, { state: { product } });
  };

  const handleAddToCart = (product, e) => {
    // Stop event propagation to prevent navigation when clicking the cart button
    e.stopPropagation();
    
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

  const handleToggleWishlist = async (product, e) => {
    // Stop event propagation to prevent navigation when clicking the wishlist button
    e.stopPropagation();
    
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
          discount_price: product.discount_price,
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

  // Helper function to format price
  const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numPrice)) {
      return price;
    }
    
    return numPrice.toFixed(2);
  };

  // Helper function to construct proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) return <div className="text-center text-xl font-bold mt-32">Loading products...</div>;
  if (error) return <div className="text-red-500 text-center mt-32">{error}</div>;
  if (products.length === 0) return <div className="text-gray-500 text-center mt-32">No new arrivals available.</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      <div className="flex-1">
        <div className="container mx-auto px-4 mt-40">
          <h1 className="text-3xl font-bold mb-8 text-center">New Launch</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-xl text-gray-500">No products match your filters</p>
              </div>
            ) : (
              products.map((product) => {
                const isWishlisted = wishlist.has(product._id || product.id);
                const displayPrice = product.discount_price || product.price;
                const originalPrice = product.price;

                return (
                  <div 
                    key={product._id || product.id} 
                    className="border rounded-lg overflow-hidden shadow-lg bg-white flex flex-col items-center relative cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => handleProductClick(product)}
                  >
                    <img 
                      src={getImageUrl(product.image)} 
                      alt={product.name} 
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                      }}
                    />
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
                    <div className="p-4 text-left w-full">
                      <h2 className="text-2xl font-bold">{product.name}</h2>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          {product.discount_price && product.discount_price !== product.price && (
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
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;