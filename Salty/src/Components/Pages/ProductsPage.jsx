// import React, { useContext } from "react";
// import { FilterContext } from "./FilterContext";

// const ProductsPage = () => {
//   const { filteredProducts } = useContext(FilterContext);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-4">Filtered Products</h2>

//       {filteredProducts.length === 0 ? (
//         <p>No products match the selected filters.</p>
//       ) : (
//         <div className="grid grid-cols-3 gap-4">
//           {filteredProducts.map((product) => (
//             <div key={product.id} className="border p-4 rounded shadow">
//               <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
//               <h3 className="mt-2 font-semibold">{product.name}</h3>
//               <p className="text-gray-600">Rs. {product.price}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductsPage;
