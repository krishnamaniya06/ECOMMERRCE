import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useCartStore from '../cartStore';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CharmsAndPendantsProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchCharmsAndPendantsProducts = async () => {
      try {
        setLoading(true);
        console.log('Fetching Charms & Pendants products from: http://localhost:5000/api/products/type/charms & pendants');
        
        // URL encoding the space and ampersand
        const encodedUrl = 'http://localhost:5000/api/products/type/charms & pendants';
        const response = await axios.get(encodedUrl);
        
        console.log('Charms & Pendants products received:', response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Charms & Pendants products:', err);
        setError('Failed to load Charms & Pendants products. Please try again later.');
        setLoading(false);
      }
    };

    fetchCharmsAndPendantsProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1
    });
    toast.success(`${product.name} added to cart!`);
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
    
    if (imagePath.startsWith('/')) {
      return `http://localhost:5000${imagePath}`;
    } else {
      return `http://localhost:5000/${imagePath}`;
    }
  };

  if (loading) return <div className="container mx-auto mt-32 text-center">Loading Charms & Pendants products...</div>;
  if (error) return <div className="container mx-auto mt-32 text-center text-red-500">{error}</div>;
  if (products.length === 0) return <div className="container mx-auto mt-32 text-center">No Charms & Pendants products found.</div>;
  
  // Custom simplified sidebar for Charms & Pendants
  const SimplifiedSidebar = () => {
    const productTypes = [
      'Body Chains',
      'Bracelets',
      'Charms & Pendants',
      'Earrings',
      'Gift Box',
      'Jewelry Sets',
      'Keychains',
      'Necklaces',
      'Rings',
      'Set of Earrings',
      'Set of Rings'
    ];

    return (
      <div className="fixed-top-6 left-0 my-0 w-64 p-4 border-r text-black text-sm bg-white overflow-auto">
        <div className="mb-4">
          <div className="text-sm font-semibold pb-2 border-b">
            PRODUCT CATEGORY
          </div>
          <div className="mt-1">
            <div className="flex flex-col items-start space-y-2">
              {productTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2 w-full">
                  <Link
                    to={`/products/type/${type.toLowerCase()}`}
                    className={`text-gray-800 w-full text-left cursor-pointer hover:text-[#7B3F00] ${
                      type === 'Charms & Pendants' ? 'font-semibold text-[#7B3F00]' : ''
                    }`}
                  >
                    {type}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />
      
      <div className="flex flex-1 my-35">
      <Sidebar />

        <div className="container mx-auto px-4 mt-10 ml-64">
          <h1 className="text-3xl font-bold mb-8 text-center">Charms & Pendants Collection</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">₹{formatPrice(product.price)}</span>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="bg-gradient-to-r from-[#7B3F00] to-[#C19A6B] text-white px-4 py-2 rounded hover:opacity-90 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

  );
};

export default CharmsAndPendantsProducts;