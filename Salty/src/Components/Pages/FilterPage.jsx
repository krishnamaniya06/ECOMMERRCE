import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import Loader from "../common/Loader";

const FilterPage = () => {
  const { filterType } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/all");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sorting logic based on filterType
  const sortedData = [...data].sort((a, b) => {
    switch (filterType) {
      case "alphabetical-a-z":
        return a.name.localeCompare(b.name);
      case "alphabetical-z-a":
        return b.name.localeCompare(a.name);
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      default:
        return 0;
    }
  });

//   if (loading) return <p className="text-center"><Loader /></p>;
//   if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1 my-35">
        {/* Sidebar */}
        <Sidebar />
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Showing results for: {filterType.replace("-", " ")}
      </h2>
      {loading && <Loader /> }
      <div className="container p-5 mx-0 my-20 px-5 sm:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sortedData.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition"
          >
            <img
              src={`http://localhost:5000${item.image}`}
              alt={item.title}
              className="w-full h-80 object-cover"
            />
            <h3 className="text-lg font-medium">{item.name}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className="text-green-600 font-semibold mt-2">
              ${item.discount_price}
            </p>
          </div>
        ))} 
        
        </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
