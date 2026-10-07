import React from "react";

function AdminLoader({ message = "Loading data from server..." }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
      <div
        className="spinner-border text-primary mb-3"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <h6 className="fw-bold text-dark">{message}</h6>
      <p className="text-muted small">Synchronizing with MongoDB Atlas</p>
    </div>
  );
}

export default AdminLoader;
