import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../services/api";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaSignInAlt,
  FaUserPlus,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.error || "");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    const normalizedEmail = email.trim().toLowerCase();

    try {
      if (isRegister) {
        // Validation
        if (!name.trim()) {
          setError("Please enter your full name.");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters long.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match. Please verify.");
          setLoading(false);
          return;
        }

        // Register API Call (Role is automatically assigned as User on backend)
        const response = await api.post("/auth/register", {
          name: name.trim(),
          email: normalizedEmail,
          password,
          phone: phone.trim(),
        });

        const token = response.data?.token;
        const userObj = response.data?.user;

        if (token) {
          localStorage.setItem("token", token);
        }
        if (userObj) {
          localStorage.setItem("user", JSON.stringify(userObj));
          localStorage.setItem("currentUser", JSON.stringify(userObj));
        }

        window.dispatchEvent(new Event("authChange"));
        setSuccessMsg(`Welcome, ${userObj?.name || 'User'}! Account created successfully.`);

        setTimeout(() => {
          if (String(userObj?.role).toLowerCase() === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/profile");
          }
        }, 1000);

      } else {
        // Login API Call
        const response = await api.post("/auth/login", {
          email: normalizedEmail,
          password,
        });

        const token = response.data?.token;
        const userObj = response.data?.user;

        if (token) {
          localStorage.setItem("token", token);
        }
        if (userObj) {
          localStorage.setItem("user", JSON.stringify(userObj));
          localStorage.setItem("currentUser", JSON.stringify(userObj));
        }

        window.dispatchEvent(new Event("authChange"));
        setSuccessMsg(`Welcome back, ${userObj?.name || 'User'}!`);

        setTimeout(() => {
          if (String(userObj?.role).toLowerCase() === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Authentication failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setIsRegister(false);
    setEmail("hv0563163@gmail.com");
    setPassword("123456789");
    setError("");
  };

  return (
    <div className="login-page py-5">
      <div className="auth-card card shadow-lg border-0 rounded-4">
        
        {/* Header */}
        <div className="auth-header text-center">
          <div className="brand-logo d-flex align-items-center justify-content-center gap-2 mb-2">
            <FaShieldAlt className="text-primary" />
            <span className="fw-bold">MyWebsite Portal</span>
          </div>
          <h2 className="fw-bold fs-4 text-dark mb-1">
            {isRegister ? "Create User Account" : "Sign In to Account"}
          </h2>
          <p className="text-muted small">
            {isRegister
              ? "Register a standard customer account for shopping & order tracking"
              : "Access your dashboard, manage profile or view past orders"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs mb-4">
          <button
            type="button"
            className={`tab-btn ${!isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(false);
              setError("");
              setSuccessMsg("");
            }}
          >
            <FaSignInAlt className="me-1" /> Sign In
          </button>
          <button
            type="button"
            className={`tab-btn ${isRegister ? "active" : ""}`}
            onClick={() => {
              setIsRegister(true);
              setError("");
              setSuccessMsg("");
            }}
          >
            <FaUserPlus className="me-1" /> Register
          </button>
        </div>

        {/* Banners */}
        {error && (
          <div className="alert alert-danger rounded-3 small py-2 px-3 d-flex align-items-center mb-3">
            <FaExclamationTriangle className="me-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success rounded-3 small py-2 px-3 d-flex align-items-center mb-3">
            <FaCheckCircle className="me-2 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="auth-form">
          {isRegister && (
            <div className="form-group mb-3">
              <label className="form-label fw-bold text-dark">Full Name *</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary"><FaUser /></span>
                <input
                  type="text"
                  className="form-control border-start-0 bg-light"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group mb-3">
            <label className="form-label fw-bold text-dark">Email Address *</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-secondary"><FaEnvelope /></span>
              <input
                type="email"
                className="form-control border-start-0 bg-light"
                required
                placeholder="e.g. name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {isRegister && (
            <div className="form-group mb-3">
              <label className="form-label fw-bold text-dark">Phone Number (Optional)</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary"><FaPhone /></span>
                <input
                  type="tel"
                  className="form-control border-start-0 bg-light"
                  placeholder="e.g. 9817200000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group mb-3">
            <label className="form-label fw-bold text-dark">Password *</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0 text-secondary"><FaLock /></span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control border-start-0 border-end-0 bg-light"
                required
                placeholder={isRegister ? "At least 6 characters" : "Enter password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-group-text bg-light border-start-0 text-secondary"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="form-group mb-3">
              <label className="form-label fw-bold text-dark">Confirm Password *</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary"><FaLock /></span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control border-start-0 border-end-0 bg-light"
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 text-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill py-2 font-weight-bold text-white shadow-sm mt-3 d-flex align-items-center justify-content-center"
            disabled={loading}
          >
            {loading ? (
              <span>Processing...</span>
            ) : isRegister ? (
              <>
                <FaUserPlus className="me-2" /> Register Customer Account
              </>
            ) : (
              <>
                <FaSignInAlt className="me-2" /> Sign In to Account
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer mt-4 pt-3 border-top text-center">
          <div className="demo-shortcut mb-3 p-2 bg-light rounded-3">
            <span className="small text-muted d-block mb-1">👑 Admin Panel Owner Shortcut:</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary rounded-pill font-weight-bold"
              onClick={fillDemoAdmin}
            >
              Auto-fill Admin Login (`hv0563163@gmail.com`)
            </button>
          </div>

          <div className="store-link-wrapper">
            <Link to="/" className="text-decoration-none text-muted small">
              ← Return to Main Store Front
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;

