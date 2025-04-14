import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FilterContext } from "./FilterContext";
import Loader from "../common/Loader";
import useCartStore from "../cartStore";
import Navbar from "../Navbar";
import { toast } from 'react-toastify';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import axios from 'axios';

const WomenCategoryPage = () => {
  const { filters } = useContext(FilterContext);
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();

        if (filters.categories.length > 0) {
          queryParams.append("category", filters.categories[0]);
        }

        const response = await fetch(`http://localhost:5000/api/products/all?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

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
      qty: 1,
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
    if (!imagePath) {
      return 'https://via.placeholder.com/300x300?text=No+Image';
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    return `http://localhost:5000${imagePath}`;
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="pt-0 mx-5">
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <Navbar />
        
        <div className="flex-1">
          <div className="flex justify-between items-center my-5 px-5 md:px-20">
            <h1 className="text-3xl font-serif font-semibold text-center mx-120 mt-40">Women's Collection</h1>
          </div>

          <div className="container p-5 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-xl text-gray-500">No products match your filters</p>
              </div>
            ) : (
              products.filter((data) => data.category === "women").map((item) => {
                const isWishlisted = wishlist.has(item._id || item.id);
                
                return (
                  <div 
                    key={item._id} 
                    className="border rounded-lg overflow-hidden shadow-lg bg-white flex flex-col items-center relative cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => handleProductClick(item)}
                  >
                    <div className="w-full h-80 relative">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          console.log('Image load error for:', item.name);
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                        }}
                      />
                      {/* Heart Icon for Wishlist */}
                      <button
                        onClick={(e) => handleToggleWishlist(item, e)}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 transition"
                      >
                        {isWishlisted ? (
                          <FaHeart className="text-red-500 text-2xl" />
                        ) : (
                          <FaRegHeart className="text-gray-500 text-2xl hover:text-red-500" />
                        )}
                      </button>
                    </div>
                    <div className="p-4 text-left w-full">
                      <h2 className="text-2xl font-bold">{item.name}</h2>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <span className="text-gray-700 italic font-semibold line-through">
                            ₹{formatPrice(item.price)}
                          </span>
                          <span className="text-gray-700 font-bold">
                            ₹{formatPrice(item.discount_price || item.price)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleAddToCart(item, e)}
                          className="px-4 py-2 bg-[#8B5A2B] text-white rounded-lg hover:bg-[#8B5A2B] transition"
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
    </main>
  );
};

export default WomenCategoryPage;