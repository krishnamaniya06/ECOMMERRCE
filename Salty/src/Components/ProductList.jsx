// import React from "react";
// import useCartStore from "../store/cartStore";

// const products = [
//   { id: 1, name: "Necklace", price: 50 },
//   { id: 2, name: "Earrings", price: 30 },
// ];

// const ProductList = () => {
//   const addToCart = useCartStore((state) => state.addToCart);

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Products</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {products.map((product) => (
//           <div key={product.id} className="p-4 border rounded-lg">
//             <h3 className="text-lg font-semibold">{product.name}</h3>
//             <p className="text-gray-600">${product.price}</p>
//             <button
//               onClick={() => addToCart(product)}
//               className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
//             >
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductList;
