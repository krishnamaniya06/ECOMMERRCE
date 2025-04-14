import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FilterContext } from "./FilterContext";
import useCartStore from "../cartStore";
import { toast } from "react-toastify";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const BodyChainProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters } = useContext(FilterContext);
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBodyChains = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.priceRange && filters.priceRange.length === 2) {
          queryParams.append("minPrice", filters.priceRange[0]);
          queryParams.append("maxPrice", filters.priceRange[1]);
        }
        if (filters.colors && filters.colors.length > 0) {
          filters.colors.forEach((color) => queryParams.append("colors", color));
        }
        if (filters.materials && filters.materials.length > 0) {
          filters.materials.forEach((material) => queryParams.append("materials", material));
        }

        const url = `http://localhost:5000/api/products/type/body chains${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;

        const response = await axios.get(url);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching body chain products:", err);
        setError("Failed to fetch body chain products. Please try again later.");
        setLoading(false);
      }
    };

    fetchBodyChains();
  }, [filters]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const formatPrice = (price) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return isNaN(numPrice) ? price : numPrice.toFixed(2);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x300?text=No+Image";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
    return imagePath.startsWith("/")
      ? `http://localhost:5000${imagePath}`
      : `http://localhost:5000/${imagePath}`;
  };

  if (loading) return <div className="text-center p-8">Loading Body Chains...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (products.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">No Body Chains Found</h2>
        <p className="text-gray-600">Try adjusting your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 my-35">
      <Sidebar />
    
        <div className="container mx-auto px-4 mt-10">
          <h1 className="text-3xl font-bold mb-8 text-center">Body Chains Collection</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative w-full h-80">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Available";
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

export default BodyChainProducts;
