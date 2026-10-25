import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const [, setTick] = useState(0);

  const getAuthState = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user") || localStorage.getItem("currentUser");
    let user = null;

    try {
      user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
    } catch (e) {
      user = null;
    }

    return { token, user, isAuthenticated: Boolean(token || user) };
  };

  const { user, isAuthenticated } = getAuthState();

  // Revalidate authentication on browser Back/Forward (pageshow), cross-tab changes, and focus
  useEffect(() => {
    const revalidate = () => {
      setTick((t) => t + 1);
    };

    window.addEventListener("pageshow", revalidate);
    window.addEventListener("storage", revalidate);
    window.addEventListener("authChange", revalidate);
    window.addEventListener("focus", revalidate);

    return () => {
      window.removeEventListener("pageshow", revalidate);
      window.removeEventListener("storage", revalidate);
      window.removeEventListener("authChange", revalidate);
      window.removeEventListener("focus", revalidate);
    };
  }, []);

  // If user is not authenticated at all
  if (!isAuthenticated) {
    if (adminOnly) {
      return (
        <Navigate
          to="/admin/login"
          replace
          state={{ error: "Please sign in as Admin to access the dashboard." }}
        />
      );
    }

    // Customer redirect to /auth with return path
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={`/auth?redirect=${returnUrl}`}
        replace
        state={{ error: "Please login or create an account to proceed to checkout." }}
      />
    );
  }

  // Admin access check
  if (adminOnly) {
    if (!user || String(user.role).toLowerCase() !== "admin") {
      return (
        <Navigate
          to="/login"
          replace
          state={{ error: "Access denied. Only Admin accounts can access the panel." }}
        />
      );
    }
  }

  return children;
}

export default ProtectedRoute;
