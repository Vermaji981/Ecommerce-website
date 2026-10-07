import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaPlusCircle,
  FaTags,
  FaShoppingBag,
  FaUsers,
  FaImage,
  FaPercent,
  FaStar,
  FaCog,
  FaSignOutAlt,
  FaStore
} from "react-icons/fa";

function AdminSidebar({ isOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("authChange"));
    navigate("/admin/login");
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <div className="logo-icon bg-primary text-white rounded-circle p-2 d-flex align-items-center justify-content-center">⚡</div>
        <div className="logo-text ms-2">
          <h3 className="fs-6 fw-bold mb-0 text-white">AdminHub</h3>
          <p className="text-muted small mb-0 fs-8">My E-commerce Management</p>
        </div>
      </div>

      <nav className="sidebar-nav mt-3">
        <div className="nav-section-title px-3 mb-2">MAIN MENU</div>

        <NavLink to="/admin" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaTachometerAlt className="me-2" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/products" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaBoxOpen className="me-2" />
          <span>Products</span>
        </NavLink>

        <NavLink to="/admin/add-product" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaPlusCircle className="me-2" />
          <span>Add Product</span>
        </NavLink>

        <NavLink to="/admin/categories" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaTags className="me-2" />
          <span>Categories</span>
        </NavLink>

        <NavLink to="/admin/orders" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaShoppingBag className="me-2" />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/admin/users" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaUsers className="me-2" />
          <span>Users</span>
        </NavLink>

        <div className="nav-section-title px-3 mt-4 mb-2">MARKETING & REVIEWS</div>

        <NavLink to="/admin/banners" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaImage className="me-2" />
          <span>Banners</span>
        </NavLink>

        <NavLink to="/admin/offers" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaPercent className="me-2" />
          <span>Offers & Coupons</span>
        </NavLink>

        <NavLink to="/admin/reviews" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaStar className="me-2" />
          <span>Customer Reviews</span>
        </NavLink>

        <div className="nav-section-title px-3 mt-4 mb-2">SYSTEM & STORE</div>

        <NavLink to="/admin/settings" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FaCog className="me-2" />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/" target="_blank" className="nav-item store-preview-link mt-2 text-info">
          <FaStore className="me-2" />
          <span>View Customer Store ↗</span>
        </NavLink>

        <button
          type="button"
          className="nav-item w-100 bg-transparent border-0 text-start text-danger mt-3 cursor-pointer"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          <span>Logout Admin</span>
        </button>
      </nav>

      <div className="sidebar-footer mt-auto p-3 border-top border-secondary-subtle">
        <div className="status-indicator d-flex align-items-center gap-2">
          <span className="dot pulse bg-success rounded-circle" style={{ width: "10px", height: "10px" }}></span>
          <span className="text-white-50 fs-8">MongoDB Connected</span>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
