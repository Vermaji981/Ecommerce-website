import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
  const adminToken =
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken") ||
    localStorage.getItem("token");

  const adminUserString =
    localStorage.getItem("adminUser") ||
    sessionStorage.getItem("adminUser") ||
    localStorage.getItem("user") ||
    localStorage.getItem("currentUser");

  let user = null;

  try {
    if (adminUserString) {
      user = JSON.parse(adminUserString);
    }
  } catch (e) {
    console.error("Error parsing user state in ProtectedAdminRoute:", e);
  }

  // 1. Not Authenticated -> Redirect to Admin Login
  if (!adminToken || !user) {
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
