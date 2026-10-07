import { Link, useNavigate } from "react-router-dom";
import Logo from "../../image/icon/website-icon.png";
import React, { useEffect, useState } from "react";
import CountryDropdown from "../countrydrop";
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import { FaPlus, FaSignOutAlt, FaUserCheck } from "react-icons/fa";
import SearchBox from "./searchbox";
import NavBar from "./Navigation";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const navigate = useNavigate();
  const { cartCount, cartTotal } = useCart();
  const [currentUser, setCurrentUser] = useState(null);

  const syncUser = () => {
    try {
      const stored = localStorage.getItem("currentUser") || localStorage.getItem("user");
      if (stored && stored !== "undefined") {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    syncUser();
    const handleAuthChange = () => syncUser();

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("authChange"));
    setCurrentUser(null);
    navigate("/auth");
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isAdmin = currentUser && String(currentUser.role).toLowerCase() === "admin";

  return (
    <div className="header">
      <div className="container">
        <div className="header-logo">
          <Link to={"/"}>
            <img src={Logo} alt="Logo" />
          </Link>
        </div>

        <div className="part2">
          <CountryDropdown />
        </div>

        <SearchBox />

        <div className="bellicons d-flex align-items-center ml-auto">
          {isAdmin && (
            <>
              <Link
                to="/admin"
                className="btn btn-primary btn-sm rounded-pill mr-2 d-none d-md-inline-flex align-items-center"
                style={{ textDecoration: "none", fontSize: "0.85rem", background: "linear-gradient(135deg, #0284c7, #0369a1)", border: "none" }}
                title="Open Admin Dashboard"
              >
                ⚡ Admin Dashboard
              </Link>

              <Link
                to="/admin/add-product"
                className="btn btn-outline-primary btn-sm rounded-pill mr-2 d-none d-md-inline-flex align-items-center"
                style={{ textDecoration: "none", fontSize: "0.85rem" }}
                title="Add New Product to DB"
              >
                <FaPlus className="mr-1" /> Add Product
              </Link>
            </>
          )}

          {currentUser ? (
            <div className="d-flex align-items-center mr-3 header-user-menu">
              <Link
                to="/profile"
                className="circle text-primary bg-primary-subtle"
                style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                title={`Logged in as ${currentUser.name || currentUser.email}`}
              >
                <FaUserCheck />
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline-danger rounded-pill ml-2 d-none d-lg-inline-flex align-items-center"
                title="Logout Account"
                style={{ fontSize: "0.78rem", padding: "3px 10px" }}
              >
                <FaSignOutAlt className="mr-1" /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="circle mr-3"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
              title="Login / Register Account"
            >
              <FiUser />
            </Link>
          )}

          <Link to="/cart" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="ml-auto cartTab d-flex align-items-center">
              <span className="price">{formatPrice(cartTotal)}</span>
              <div className="position-relative ml-2">
                <button className="circle">
                  <IoBagOutline />
                </button>
                <span className="count d-flex align-items-center justify-content-center">
                  {cartCount}
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <NavBar />
    </div>
  );
};

export default Header;