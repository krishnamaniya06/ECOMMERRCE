import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../Navbar';
import useCartStore from '../cartStore';

const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const locationProduct = location.state?.product;
  const [product, setProduct] = useState(locationProduct || null);
  const [loading, setLoading] = useState(!locationProduct);
  const [error, setError] = useState(null);
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(new Set());

  // Fetch product if not available from location state
  useEffect(() => {
    if (!locationProduct && id) {
      const fetchProduct = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${id}`);
          setProduct(response.data);
        } catch (err) {
          console.error('Error fetching product:', err);
          setError('Failed to load product details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, locationProduct]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/wishlist");
        setWishlist(new Set(response.data.map(item => item.product_id)));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) return <div className="container mx-auto mt-32 text-center">Loading product details...</div>;
  if (error) return <div className="container mx-auto mt-32 text-center text-red-500">{error}</div>;
  
  // If no product is found, show an error and navigation back
  if (!product) {
    return (
      <div className="container mx-auto mt-32 text-center">
        <div className="text-xl mb-4">No product details available</div>
        <button 
          onClick={() => navigate(-1)} 
          className="bg-[#8B5A2B] text-white px-4 py-2 rounded-lg hover:bg-[#6A4320] transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      discount_price: product.discount_price || product.price,
      image: product.image,
      qty: quantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = async () => {
    const productId = product._id || product.id;
    const updatedWishlist = new Set(wishlist);
    try {
      if (wishlist.has(productId)) {
        await axios.delete(`http://localhost:5000/api/wishlist/${productId}`);
        updatedWishlist.delete(productId);
        toast.warn(`${product.name} removed from wishlist!`);
      } else {
        await axios.post("http://localhost:5000/api/wishlist", { 
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
      console.error("Error updating wishlist:", error);
      toast.error(`Failed to ${wishlist.has(productId) ? 'remove from' : 'add to'} wishlist`);
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };
 
  const isWishlisted = wishlist.has(product._id || product.id);

  // Helper function to get proper image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/600x600?text=No+Image';
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-40 pb-10">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center text-[#8B5A2B] hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to products
        </button>
        
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <img 
                src={getImageUrl(product.image)} 
                alt={product.name} 
                className="w-full h-[600px] object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Available';
                }}
              />
              <button
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-200 transition"
              >
                {isWishlisted ? (
                  <FaHeart className="text-red-500 text-2xl" />
                ) : (
                  <FaRegHeart className="text-gray-500 text-2xl hover:text-red-500" />
                )}
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            
            <div className="flex items-center gap-5">
              <p className="text-2xl font-semibold text-gray-900">
                ₹{product.discount_price || product.price}
              </p>
              {product.discount_price && product.discount_price !== product.price && (
                <p className="text-gray-700 italic font-semibold">
                  <del>₹{product.price}</del>
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 bg-[#8B5A2B] text-white rounded-lg hover:bg-[#6A4320] transition"
              >
                Add to Cart
              </button>
            </div>
            
            <div>
              <h2 className="text-xl font-medium mb-2">Product Details</h2>
              <p className="text-gray-700 text-lg">{product.description || "No detailed description available for this product."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;