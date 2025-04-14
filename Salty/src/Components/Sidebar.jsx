import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FilterContext } from "./Pages/FilterContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Sidebar = ({ currentProductType }) => {
  const { filters, updateFilters, updatePriceRange, applyFilters } = useContext(FilterContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    price: true,
    category: true,
    color: false,
    material: false,
  });

  // Parse string data format into array of objects - without counts
  const parseFilterData = (dataString) => {
    if (!dataString) return [];
    return dataString.split(',').map(item => {
      const name = item.split(':')[0];
      return { name };
    });
  };

  // Auto-select current product type in filters when component mounts or type changes
  useEffect(() => {
    if (currentProductType) {
      const categories = parseFilterData(filtersData.categories);
      const matchingCategory = categories.find(
        category => category.name.toLowerCase() === currentProductType.toLowerCase()
      );
      
      if (matchingCategory && !filters.categories.includes(matchingCategory.name)) {
        updateFilters("categories", matchingCategory.name);
      }
    }
  }, [currentProductType, filters.categories, updateFilters]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Helper function to convert category name to URL-friendly format
  const formatCategoryForUrl = (categoryName) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  // Handle category selection - toggles selection and navigates based on category
  const handleCategorySelect = (categoryName) => {
    // Check if the category is already selected
    const isCurrentlySelected = filters.categories.includes(categoryName);
    
    // Update filter state (add or remove)
    updateFilters("categories", categoryName);
    
    // Only navigate to the product type page if we're selecting (not deselecting)
    if (!isCurrentlySelected) {
      // Special cases for specific categories
      if (categoryName === "Gift Box") {
        navigate("/products/type/gift box"); // Navigate to Gift Box page
      } else if (categoryName === "Set of Earrings") {
        navigate("/products/type/set of earrings");
      } else if (categoryName === "Charms & Pendants") {
        navigate("/products/type/charms & pendants"); // Navigate to Charms & Pendants page
      } else if (categoryName === "Body Chains") {
        navigate("/products/type/body chains");// Navigate to Body Chains page
      } else if (categoryName === "Jewelry Sets") {
        navigate("/products/type/jewelry sets");
      } else if (categoryName === "Set of Rings") {
        navigate("/products/type/set of rings");      
      } else {// For other categories, use the standard product type route
        const urlPath = formatCategoryForUrl(categoryName);
        navigate(`/products/type/${urlPath}`);
      }
    }
    // When deselecting, we don't navigate anywhere - just stay on current page
  };

  // Handle non-category filter selection
  // Handle non-category filter selection
const handleFilterSelect = (filterType, filterValue) => {
  updateFilters(filterType, filterValue);

  if (filterType === "materials") {
    navigate(`/products/material/${encodeURIComponent(filterValue)}`);
  } else {
    applyFilters();
  }
};


  // Apply price range filter and maintain product type
  const handlePriceRangeUpdate = (values) => {
    updatePriceRange(values);
    
    // If we're on a product type page, stay there
    if (location.pathname.includes('/products/type/')) {
      applyFilters();
    }
  };

  const filtersData = {
    categories: "Body Chains,Bracelets,Charms & Pendants,Earrings,Gift Box,Jewelry Sets,Keychains,Necklaces,Rings,Set of Earrings,Set of Rings",
    materials: "14K Gold,18K Gold,Silver,Alloy,Brass,Stainless Steel"
  };

  return (
    <div className="fixed-top-6 left-0 my-0 w-64 p-4 border-r text-black text-sm bg-white overflow-auto">
      <FilterSection title="PRICE" isOpen={openSections.price} toggle={() => toggleSection("price")}>
        <div className="flex justify-between text-gray-700 text-xs">
          <span>Rs. {filters.priceRange[0].toFixed(2)}</span>
          <span>Rs. {filters.priceRange[1].toFixed(2)}</span>
        </div>
        <Slider
          range
          min={0}
          max={5999}
          step={10}
          value={filters.priceRange}
          onChange={updatePriceRange}
          onAfterChange={handlePriceRangeUpdate}
        />
      </FilterSection>

      <FilterSection title="PRODUCT CATEGORY" isOpen={openSections.category} toggle={() => toggleSection("category")}>
        <CategoryList 
          categories={parseFilterData(filtersData.categories)} 
          selectedItems={filters.categories} 
          onSelectCategory={handleCategorySelect} 
        />
      </FilterSection>


      <FilterSection title="MATERIAL" isOpen={openSections.material} toggle={() => toggleSection("material")}>
        <FilterList 
          items={parseFilterData(filtersData.materials)} 
          selectedItems={filters.materials} 
          type="materials" 
          updateFilters={(type, value) => handleFilterSelect(type, value)} 
        />
      </FilterSection>
    </div>
  );
};

const FilterSection = ({ title, isOpen, toggle, children }) => (
  <div className="mb-4">
    <button onClick={toggle} className="flex justify-between items-center w-full text-sm font-semibold pb-2 border-b">
      {title} {isOpen ? <FaChevronUp /> : <FaChevronDown />}
    </button>
    {isOpen && <div className="mt-1">{children}</div>}
  </div>
);

// Special component for category list with navigation links
const CategoryList = ({ categories, selectedItems, onSelectCategory }) => (
  <div className="flex flex-col items-start space-y-2">
    {categories.map((category) => (
      <div key={category.name} className="flex items-center space-x-2 w-full">
        <input 
          type="checkbox" 
          className="w-4 h-4" 
          checked={selectedItems.includes(category.name)} 
          onChange={() => onSelectCategory(category.name)} 
          id={`category-${category.name}`}
        />
        <label 
          htmlFor={`category-${category.name}`}
          className="text-gray-800 w-full text-left cursor-pointer hover:text-[#7B3F00]"
        >
          {category.name}
        </label>
      </div>
    ))}
  </div>
);

// Regular filter list for non-navigable filters
const FilterList = ({ items, selectedItems, type, updateFilters }) => (
  <div className="flex flex-col items-start space-y-2">
    {items.map((item) => (
      <div key={item.name} className="flex items-center space-x-2 w-full">
        <input 
          type="checkbox" 
          className="w-4 h-4" 
          checked={selectedItems.includes(item.name)} 
          onChange={() => updateFilters(type, item.name)} 
          id={`${type}-${item.name}`}
        />
        <label 
          htmlFor={`${type}-${item.name}`}
          className="text-gray-800 w-full text-left"
        >
          {item.name}
        </label>
      </div>
    ))}
  </div>
);

export default Sidebar;