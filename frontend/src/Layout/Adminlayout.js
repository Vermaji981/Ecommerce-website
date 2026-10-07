import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../component/AdminNavbar";
import AdminSidebar from "../component/AdminSidebar";

function Adminlayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="admin-app-layout">
      <AdminNavbar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      <div className="admin-body">
        <AdminSidebar isOpen={sidebarOpen} />
        <main className={`admin-main-content ${sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Adminlayout;
