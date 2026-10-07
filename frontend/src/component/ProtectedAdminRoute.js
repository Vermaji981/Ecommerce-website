import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user") || localStorage.getItem("currentUser");
  let user = null;

  try {
    if (userString) {
      user = JSON.parse(userString);
    }
  } catch (e) {
    console.error("Error parsing user state in ProtectedAdminRoute:", e);
  }

  // 1. Not Authenticated -> Redirect to Admin Login
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. Authenticated but NOT an Admin -> Redirect to Unauthorized 403 Page
  if (String(user.role).toLowerCase() !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Authorized Super Admin -> Render Protected Layout/Route
  return <Outlet />;
}

export default ProtectedAdminRoute;
