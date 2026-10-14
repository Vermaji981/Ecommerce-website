import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user") || localStorage.getItem("currentUser");
  let user = null;

  try {
    user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }

  const isAuthenticated = Boolean(token || user);

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
