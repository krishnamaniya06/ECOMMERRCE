import { createContext, useState, useEffect } from "react";

export const FilterContext = createContext();

export const FilterContextProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 5999],
    categories: [],
    colors: [],
    materials: [],
  });

  const [filteredProducts, setFilteredProducts] = useState([]); // Store fetched products

  // Function to update filters
  const updateFilters = (type, value) => {
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value],
    }));
  };

  // Function to update price range
  const updatePriceRange = (range) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
  };

  // Fetch filtered products ONLY when "Set of Rings" is selected
  useEffect(() => {
    if (!filters.categories.includes("Set of Rings (12)")) {
      setFilteredProducts([]); // Reset products when "Set of Rings" is unchecked
      return;
    }

    const fetchFilteredProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("category", "Set of Rings (12)");
        if (filters.colors.length > 0) {
          queryParams.append("color", filters.colors.join(","));
        }
        if (filters.materials.length > 0) {
          queryParams.append("material", filters.materials.join(","));
        }
        queryParams.append("minPrice", filters.priceRange[0]);
        queryParams.append("maxPrice", filters.priceRange[1]);

        const response = await fetch(
          `http://192.168.29.85:5000/api/products/type/rings?${queryParams.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch filtered products");

        const data = await response.json();
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    };

    fetchFilteredProducts();
  }, [filters]); // Fetch only when filters change

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, updateFilters, updatePriceRange, filteredProducts }}
    >
      {children}
    </FilterContext.Provider>
  );
};