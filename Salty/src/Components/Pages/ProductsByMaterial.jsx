import React, { useState, useEffect } from 'react';

const ProductsByMaterial = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductsByMaterial = async (material) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/products/material/${material}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
          // Add any necessary authentication headers
          // 'Authorization': `Bearer ${yourToken}`
        }
      });

      // Debug: Log full response for investigation
      const responseText = await response.text();
      console.log('Full server response:', responseText);

      // Attempt to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError);
        throw new Error(`Server returned non-JSON response: ${responseText.slice(0, 200)}...`);
      }

      // Check for error responses
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setProducts(data);

    } catch (error) {
      console.error('Detailed fetch error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });

      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByMaterial('silver'); // Example material
  }, []);

  // Error and loading states
  if (isLoading) return <div>Loading products...</div>;
  
  if (error) return (
    <div>
      <h2>Error Fetching Products</h2>
      <p>{error}</p>
      <button onClick={() => fetchProductsByMaterial('silver')}>Retry</button>
    </div>
  );

  // Successful render
  return (
    <div>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map(product => (
          <div key={product.id}>
            {product.name} - {product.material}
          </div>
        ))
      )}
    </div>
  );
};

export default ProductsByMaterial;