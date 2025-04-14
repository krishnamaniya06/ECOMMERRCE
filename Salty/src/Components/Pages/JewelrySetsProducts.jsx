import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FilterContext } from "./FilterContext";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";

const JewelrySetsProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters } = useContext(FilterContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJewelrySets = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        if (filters.priceRange && filters.priceRange.length === 2) {
          queryParams.append("minPrice", filters.priceRange[0]);
          queryParams.append("maxPrice", filters.priceRange[1]);
        }

        if (filters.colors && filters.colors.length > 0) {
          filters.colors.forEach(color => queryParams.append("colors", color));
        }

        if (filters.materials && filters.materials.length > 0) {
          filters.materials.forEach(material => queryParams.append("materials", material));
        }

        const url = `http://localhost:5000/api/products/type/jewelry sets${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;

        const response = await axios.get(url);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Jewelry Sets products:", err);
        setError("Failed to fetch Jewelry Sets products. Please try again later.");
        setLoading(false);
      }
    };

    fetchJewelrySets();
  }, [filters]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading Jewelry Sets...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (products.length === 0) {
    return (
    
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">No Jewelry Sets Found</h2>
        <p className="text-gray-600">
          We couldn't find any jewelry sets matching your filters. Try adjusting your filter criteria.
        </p>
      </div>
  
    );
  }

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Jewelry Sets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded-lg shadow-md cursor-pointer"
            onClick={() => handleProductClick(product._id)}
          >
            <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-full h-full object-cover rounded-md mb-4" />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-500">${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JewelrySetsProducts;
