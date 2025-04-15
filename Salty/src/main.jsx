import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import Content from "./Components/Content.jsx";
import FilterPage from "./Components/Pages/FilterPage.jsx";
import Cart from "./Components/Cart.jsx";
import Auth from "./Components/Auth.jsx";
import { FilterContextProvider } from "./Components/Pages/FilterContext.jsx";
import ProductsByType from "./Components/Pages/ProductsByType.jsx";
import AllProducts from "./Components/Pages/AllProducts.jsx";
import GiftBoxProducts from "./Components/Pages/GiftBoxProducts.jsx";
import SetOfEarringsProducts from "./Components/Pages/SetOfEarringsProducts.jsx";
import CharmsAndPendantsProducts from "./Components/Pages/CharmsAndPendantsProducts.jsx";
import BodyChainProducts from "./Components/Pages/BodyChainProducts.jsx";
import JewelrySetsProducts from "./Components/Pages/JewelrySetsProducts.jsx";
import "./index.css";
import SetOfRingsProducts from "./Components/Pages/SetOfRingsProducts.jsx";
import NewArrivalsPage from "./Components/Pages/NewArrivalsPage.jsx";
import MenCategoryPage from "./Components/Pages/MenCategoryPage.jsx";
import WomenCategoryPage from "./Components/Pages/WomenCategoryPage.jsx";
import ComboEarringsProducts from "./Components/Pages/ComboEarringsProducts.jsx";
import AntiTarnishEarrings from "./Components/Pages/AntiTarnishEarrings.jsx";
import AntiTarnishNecklaces from "./Components/Pages/AntiTarnishNecklaces.jsx";
import WishlistPage from "./Components/WishlistPage.jsx";
import ProductsByMaterial from "./Components/Pages/ProductsByMaterial.jsx";
import ProductDetail from "./Components/Pages/ProductDetail.jsx"; 
import { AuthProvider } from "./Components/AuthContext.jsx";
import UserAcc from "./Components/Pages/UserAcc.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FilterContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/content" element={<Content />} />
            <Route path="/filter/:filterType" element={<FilterPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/useracc" element={<UserAcc />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/products/type/:type" element={<ProductsByType />} />
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/products/type/gift box" element={<GiftBoxProducts />} />
            <Route path="/products/type/set of earrings" element={<SetOfEarringsProducts />} />
            <Route path="/products/type/charms & pendants" element={<CharmsAndPendantsProducts />} />
            <Route path="/products/type/body chains" element={<BodyChainProducts />} />
            <Route path="/products/type/set of rings" element={<SetOfRingsProducts />} />
            <Route path="/products/type/jewelry sets" element={<JewelrySetsProducts />} />
            <Route path="/products/new-arrivals" element={<NewArrivalsPage />} />
            <Route path="/products/gender/men" element={<MenCategoryPage />} />
            <Route path="/products/gender/women" element={<WomenCategoryPage />} />
            <Route path="/products/type/set of earrings" element={<ComboEarringsProducts />} />
            <Route path="/products/type/anti-tarnish earrings" element={<AntiTarnishEarrings />} />
            <Route path="/products/type/anti-tarnish necklaces" element={<AntiTarnishNecklaces />} />
            <Route path="/products/material/:material" element={<ProductsByMaterial />} />
            <Route path="/" element={<Content />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </Router>
      </FilterContextProvider>
    </AuthProvider>
  </StrictMode>
);