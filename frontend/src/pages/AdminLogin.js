import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { FaShieldAlt, FaLock, FaEnvelope, FaSignInAlt, FaExclamationTriangle, FaStore } from "react-icons/fa";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("hv0563163@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const token = response.data?.token;
      const userObj = response.data?.user;

      if (!userObj || String(userObj.role).toLowerCase() !== "admin") {
        setError("Access Denied: Account exists but is not an authorized Administrator.");
        setLoading(false);
        return;
      }

      if (token && userObj) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userObj));
        localStorage.setItem("currentUser", JSON.stringify(userObj));
        window.dispatchEvent(new Event("authChange"));
        navigate("/admin");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Admin Authentication failed. Please check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page min-vh-100 d-flex align-items-center justify-content-center bg-dark text-light py-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: "440px", width: "90%", backgroundColor: "#ffffff" }}>
        
        {/* Top Header Banner */}
        <div className="bg-primary text-white text-center py-4 px-4">
          <div className="d-inline-flex p-3 rounded-circle bg-white text-primary mb-2 shadow-sm">
            <FaShieldAlt className="fs-2" />
          </div>
          <h3 className="fw-bold fs-4 mb-1">Super Admin Portal</h3>
          <p className="small mb-0 text-white-50">My E-commerce Owner Authentication</p>
        </div>

        <div className="card-body p-4 text-dark">
          {error && (
            <div className="alert alert-danger rounded-3 small py-2 px-3 d-flex align-items-center mb-3">
              <FaExclamationTriangle className="me-2 flex-shrink-0 fs-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin}>
            <div className="form-group mb-3">
              <label className="form-label fw-bold text-dark fs-7">Owner Admin Email *</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-primary border-end-0"><FaEnvelope /></span>
                <input
                  type="email"
                  className="form-control border-start-0 bg-light text-dark fw-bold"
                  required
                  placeholder="hv0563163@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label fw-bold text-dark fs-7">Owner Admin Password *</label>
              <div className="input-group">
                <span className="input-group-text bg-light text-primary border-end-0"><FaLock /></span>
                <input
                  type="password"
                  className="form-control border-start-0 bg-light text-dark fw-bold"
                  required
                  placeholder="•••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 rounded-pill py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center"
              disabled={loading}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <FaSignInAlt className="me-2" /> Sign In to Admin Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-3 border-top text-center">
            <Link to="/" className="text-decoration-none text-muted small fw-bold d-inline-flex align-items-center">
              <FaStore className="me-1" /> Return to Customer Storefront
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminLogin;
