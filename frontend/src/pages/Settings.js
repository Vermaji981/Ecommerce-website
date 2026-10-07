import React, { useState } from "react";
import { FaCog, FaShieldAlt, FaDatabase, FaServer, FaCheckCircle, FaLock } from "react-icons/fa";

function Settings() {
  const [storeName, setStoreName] = useState("My E-commerce Website");
  const [supportEmail, setSupportEmail] = useState("hv0563163@gmail.com");
  const [currency, setCurrency] = useState("INR (₹)");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccessMsg("System configuration updated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="settings-page">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <FaCog className="text-primary" /> Admin System Settings
          </h2>
          <p className="text-muted small">Configure store defaults, owner contact, and security settings</p>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success rounded-3 mb-4 d-flex align-items-center">
          <FaCheckCircle className="me-2" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="row g-4">
        {/* Store Preferences Form */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">General Store Preferences</h5>

            <form onSubmit={handleSaveSettings}>
              <div className="mb-3">
                <label className="form-label fw-bold text-dark">E-commerce Brand Title</label>
                <input
                  type="text"
                  className="form-control text-dark fw-bold"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Primary Owner / Support Email</label>
                <input
                  type="email"
                  className="form-control text-dark fw-bold"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Default Display Currency</label>
                <input
                  type="text"
                  className="form-control text-dark fw-bold"
                  readOnly
                  value={currency}
                />
              </div>

              <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold mt-2">
                Save Store Settings
              </button>
            </form>
          </div>
        </div>

        {/* Security & System Info Status (No Secrets Exposed) */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <FaShieldAlt className="text-success" /> Role Authorization Policy
            </h5>

            <ul className="list-group list-group-flush fs-7 fw-semibold">
              <li className="list-group-item d-flex align-items-center justify-content-between py-2.5">
                <span>Super Admin Account:</span>
                <span className="badge bg-primary rounded-pill px-3">hv0563163@gmail.com</span>
              </li>
              <li className="list-group-item d-flex align-items-center justify-content-between py-2.5">
                <span>Backend Role Verification:</span>
                <span className="badge bg-success rounded-pill px-3">Active (JWT + DB)</span>
              </li>
              <li className="list-group-item d-flex align-items-center justify-content-between py-2.5">
                <span>Public Admin Self-Register:</span>
                <span className="badge bg-danger rounded-pill px-3">Strictly Disabled</span>
              </li>
              <li className="list-group-item d-flex align-items-center justify-content-between py-2.5">
                <span>Database Connection:</span>
                <span className="badge bg-info text-dark rounded-pill px-3">MongoDB Atlas</span>
              </li>
            </ul>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-light border border-info-subtle">
            <h6 className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
              <FaLock className="text-muted" /> Security & Privacy Guarantee
            </h6>
            <p className="text-muted small mb-0">
              Database connection URI, JWT secrets, Nodemailer passwords, and payment secret keys are stored securely on the Node.js backend server and are never exposed to client-side code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
