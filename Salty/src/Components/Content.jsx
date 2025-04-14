import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { FilterContext } from "./Pages/FilterContext";
import Loader from "./common/Loader";
import useCartStore from "./cartStore";
import { toast } from "react-toastify";
import ContentDropdown from "./ContentDropdown";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import axios from "axios";

const Content = () => {
  const navigate = useNavigate();
  const { filters } = useContext(FilterContext);
  const { addToCart } = useCartStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());

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

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/wishlist");
      setWishlist(new Set(response.data.map(item => item.product_id)));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const handleAddToCart = (product, event) => {
    event.stopPropagation(); // Prevent navigation when adding to cart
    addToCart({
      id: product.id,
      name: product.name,
      discount_price: product.discount_price,
      image: product.image,
      qty: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = async (product, event) => {
    event.stopPropagation(); // Prevent navigation when toggling wishlist
    const productId = product.id;
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
      
      // Dispatch custom event to notify wishlist counter
      window.dispatchEvent(new CustomEvent("wishlistUpdated"));
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error(`Failed to ${wishlist.has(productId) ? 'remove from' : 'add to'} wishlist`);
    }
  };

  const handleProductClick = (product) => {
    // Pass the entire product object as state
    navigate(`/product/${product.id}`, { state: { product } });
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="pt-0 mx-5">
      <div className="flex-1">
        <div className="flex justify-between items-center my-10 px-5 md:px-20">
          <h1 className="text-3xl font-serif font-semibold text-center mx-80">New Launch</h1>
          <ContentDropdown />
        </div>
        <div className="container p-5 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-xl text-gray-500">No products match your filters</p>
            </div>
          ) : (
            products.map((item) => {
              const isWishlisted = wishlist.has(item.id);
              return (
                <div 
                  key={item.id} 
                  onClick={() => handleProductClick(item)}
                  className="border rounded-lg overflow-hidden shadow-lg bg-white flex flex-col items-center relative cursor-pointer hover:shadow-xl transition-shadow duration-300"
                >
                  <img 
                    src={`http://localhost:5000${item.image}`} 
                    alt={item.name} 
                    className="w-full h-80 object-cover"
                  />
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
                  <div className="p-4 text-left w-full">
                    <h2 className="text-2xl text-center font-bold">{item.name}</h2>
                    <div className="flex gap-5 justify-center">
                      <p className="text-gray-700 italic font-semibold text-center">
                        <del>₹{item.price}</del>
                      </p>
                      <p className=" text-gray-700">₹{item.discount_price}</p>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(item, e)}
                      className="mt-4 px-5 py-2 bg-[#8B5A2B] text-white rounded-lg hover:bg-[#6A4320] transition w-full"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};

export default Content;