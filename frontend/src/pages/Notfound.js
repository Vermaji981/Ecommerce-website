import React from "react";
import { Link } from "react-router-dom";

function Notfound() {
  return (
    <div className="empty-state" style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="empty-icon">🔍</div>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: "1rem" }}>Back to Store</Link>
    </div>
  );
}

export default Notfound;
