import React from "react";
import { Link } from "react-router-dom";
import { FaBan, FaStore, FaUserLock } from "react-icons/fa";

function Unauthorized() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card border-0 shadow-lg rounded-4 text-center p-4 p-md-5" style={{ maxWidth: "520px", width: "90%", backgroundColor: "#ffffff" }}>
        
        <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger p-4 mb-4 mx-auto" style={{ width: "90px", height: "90px" }}>
          <FaBan className="fs-1" />
        </div>

        <h2 className="fw-bold text-dark mb-2">403 - Access Forbidden</h2>
        <h5 className="fw-bold text-danger mb-3">Administrator Privileges Required</h5>

        <p className="text-muted mb-4">
          You do not have permission to view or manage the Admin Dashboard. This area is restricted exclusively to the store owner and verified administrators.
        </p>

        <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
          <Link to="/" className="btn btn-primary rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center justify-content-center">
            <FaStore className="me-2" /> Back to Main Store
          </Link>
          
          <Link to="/admin/login" className="btn btn-outline-danger rounded-pill px-4 py-2 fw-bold d-inline-flex align-items-center justify-content-center">
            <FaUserLock className="me-2" /> Admin Login Portal
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Unauthorized;
