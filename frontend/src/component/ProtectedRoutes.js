import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user") || localStorage.getItem("currentUser");
  let user = null;

  try {
    user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
  } catch (e) {
    user = null;
  }

  if (!token && adminOnly) {
    return <Navigate to="/login" replace state={{ error: "Please sign in as Admin to access the dashboard." }} />;
  }

  if (adminOnly) {
    if (!user || String(user.role).toLowerCase() !== "admin") {
      return <Navigate to="/login" replace state={{ error: "Access denied. Only Admin accounts can access the panel." }} />;
    }
  }

  return children;
}

export default ProtectedRoute;
