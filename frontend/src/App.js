import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Header from "./component/Header/index";
import Home from "./pages/home/index";
import Shop from "./pages/shop/index";
import ProductDetail from "./pages/productDetail/index";
import Sunglass from "./pages/OnsaleItems/Sunglass";
import Shoes from "./pages/OnsaleItems/Shoes";
import Computer from "./pages/OnsaleItems/Computer";
import Mobiles from "./pages/OnsaleItems/Mobiles";
import Grocery from "./pages/OnsaleItems/Grocery";
import Watches from "./pages/OnsaleItems/Watches";
import Fitness from "./pages/OnsaleItems/Fitness";
import Furniture from "./pages/OnsaleItems/Furniture";
import HomeKitchen from "./pages/OnsaleItems/HomeKitchen";
import Magazines from "./pages/OnsaleItems/Magazines";
import MobileCovers from "./pages/OnsaleItems/MobileCovers";
import ShopSunglasses from "./pages/shop/sunglasses";
import Footer from "./Footer/footer";
import SunglassesDetail from "./pages/sunglassesDetail/index";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutCancel from "./pages/CheckoutCancel";
import PrivacyCard from "./component/footerdata/privacy/privacy";
import Return from "./component/footerdata/privacy/Return/Return";
import Term from "./component/footerdata/privacy/Termuse/term";
import AuthPage from "./pages/auth/index";
import Cart from "./pages/Cart";
import CheckoutPayment from "./pages/CheckoutPayment";
import GovernmentPayment from "./pages/GovernmentPayment";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";

// Admin Panel Security Guards, Layout & Pages
import Login from "./pages/login";
import AdminLogin from "./pages/AdminLogin";
import Unauthorized from "./pages/Unauthorized";
import ProtectedAdminRoute from "./component/ProtectedAdminRoute";
import ProtectedRoute from "./component/ProtectedRoutes";
import InactivityHandler from "./component/InactivityHandler/InactivityHandler";
import Adminlayout from "./Layout/Adminlayout";

import Deshboard from "./pages/deshboard";
import Products from "./pages/product";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import Order from "./pages/Order";
import ActivityLogs from "./pages/ActivityLogs";
import Banners from "./pages/Banners";
import Offers from "./pages/Offers";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import Notfound from "./pages/Notfound";

function MainWebsiteLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <InactivityHandler />
        <Routes>
          {/* Public Login Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Super Admin Dashboard Shell (/admin) */}
          <Route element={<ProtectedAdminRoute />}>
            <Route element={<Adminlayout />}>
              <Route path="/admin" element={<Deshboard />} />
              <Route path="/admin/dashboard" element={<Deshboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/admin/edit-product/:id" element={<EditProduct />} />
              <Route path="/admin/categories" element={<Categories />} />
              <Route path="/admin/orders" element={<Order />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/activity-logs" element={<ActivityLogs />} />
              <Route path="/admin/banners" element={<Banners />} />
              <Route path="/admin/offers" element={<Offers />} />
              <Route path="/admin/reviews" element={<Reviews />} />
              <Route path="/admin/settings" element={<Settings />} />

              {/* Legacy Aliases for Seamless Backwards Compatibility */}
              <Route path="/dashboard" element={<Deshboard />} />
              <Route path="/deshboard" element={<Deshboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/users" element={<Users />} />
              <Route path="/orders" element={<Order />} />
            </Route>
          </Route>

          {/* Main Customer Storefront Layout */}
          <Route element={<MainWebsiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/Sunglass" element={<Sunglass />} />
            <Route path="/sunglass" element={<Sunglass />} />
            <Route path="/Shoes" element={<Shoes />} />
            <Route path="/shoes" element={<Shoes />} />
            <Route path="/Computer" element={<Computer />} />
            <Route path="/computer" element={<Computer />} />
            <Route path="/Mobiles" element={<Mobiles />} />
            <Route path="/mobiles" element={<Mobiles />} />
            <Route path="/Grocery" element={<Grocery />} />
            <Route path="/grocery" element={<Grocery />} />
            <Route path="/Watches" element={<Watches />} />
            <Route path="/watches" element={<Watches />} />
            <Route path="/Fitness" element={<Fitness />} />
            <Route path="/fitness" element={<Fitness />} />
            <Route path="/Furniture" element={<Furniture />} />
            <Route path="/furniture" element={<Furniture />} />
            <Route path="/HomeKitchen" element={<HomeKitchen />} />
            <Route path="/homekitchen" element={<HomeKitchen />} />
            <Route path="/Magazines" element={<Magazines />} />
            <Route path="/magazines" element={<Magazines />} />
            <Route path="/MobileCovers" element={<MobileCovers />} />
            <Route path="/mobilecovers" element={<MobileCovers />} />
            <Route path="/shop/sunglasses" element={<ShopSunglasses />} />
            <Route path="/sunglasses/:id" element={<SunglassesDetail />} />
            <Route path="/PrivacyCard" element={<PrivacyCard />} />
            <Route path="/privacy" element={<PrivacyCard />} />
            <Route path="/Return" element={<Return />} />
            <Route path="/Term" element={<Term />} />
            <Route path="/success" element={<CheckoutSuccess />} />
            <Route path="/cancel" element={<CheckoutCancel />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPayment />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/contact-us" element={<Contact />} />
            <Route path="*" element={<Notfound />} />
          </Route>

          {/* Dedicated Government Application Form Fee Payment Desk (Clean Standalone Official Layout) */}
          <Route path="/payment" element={<GovernmentPayment />} />
          <Route path="/application-payment" element={<GovernmentPayment />} />
          <Route path="/fee-payment" element={<GovernmentPayment />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
