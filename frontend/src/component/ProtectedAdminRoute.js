import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedAdminRoute() {
  const [, setTick] = useState(0);

  const getAdminAuth = () => {
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
      user = null;
    }

    return { adminToken, user };
  };

  const { adminToken, user } = getAdminAuth();

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

  // 1. Not Authenticated -> Redirect to Admin Login
  if (!adminToken || !user) {
    return <Navigate to="/admin/login" replace state={{ error: "Please sign in as Admin to access the dashboard." }} />;
  }

  // 2. Authenticated but NOT an Admin -> Redirect to Unauthorized 403 Page
  if (String(user.role).toLowerCase() !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Authorized Super Admin -> Render Protected Layout/Route
  return <Outlet />;
}

export default ProtectedAdminRoute;
