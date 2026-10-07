import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
  FaArrowRight,
  FaShoppingBag
} from "react-icons/fa";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Default to Register if tab=register in URL query, else Login
  const initialMode = searchParams.get("tab") === "register" ? false : true;
  const [isLogin, setIsLogin] = useState(initialMode);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sync user status on mount and when localStorage changes
  const updateLocalUser = () => {
    try {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    updateLocalUser();
    
    const handleAuthChange = () => {
      updateLocalUser();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (message.text) setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    const users = JSON.parse(localStorage.getItem("shopUsers") || "[]");

    if (isLogin) {
      // Login Logic
      if (!formData.email || !formData.password) {
        setMessage({ type: "danger", text: "Please enter both email address and password." });
        return;
      }

      const normalizedEmail = formData.email.trim().toLowerCase();

      try {
        const res = await api.loginUser({
          email: normalizedEmail,
          password: formData.password
        });

        if (res && res.success && res.user) {
          const userObj = res.user;
          const profileData = await api.getUserProfile(userObj.email).catch(() => ({}));
          const loggedUser = {
            id: userObj.id || userObj._id,
            name: userObj.name || profileData.name || normalizedEmail.split("@")[0],
            email: userObj.email || normalizedEmail,
            phone: userObj.phone || profileData.phone || "",
            role: userObj.role || "User",
            address: profileData.address || "",
            city: profileData.city || "",
            pincode: profileData.pincode || ""
          };

          if (res.token) {
            localStorage.setItem("token", res.token);
          }
          localStorage.setItem("user", JSON.stringify(loggedUser));
          localStorage.setItem("currentUser", JSON.stringify(loggedUser));

          const existingIdx = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
          const updatedUsers = existingIdx >= 0
            ? users.map((u, i) => (i === existingIdx ? { ...u, ...loggedUser } : u))
            : [...users, loggedUser];
          localStorage.setItem("shopUsers", JSON.stringify(updatedUsers));
          window.dispatchEvent(new Event("authChange"));
          setCurrentUser(loggedUser);
          setMessage({ type: "success", text: `Welcome back, ${loggedUser.name}! Redirecting...` });
          
          setTimeout(() => {
            if (String(loggedUser.role).toLowerCase() === "admin") {
              navigate("/dashboard");
            } else {
              navigate("/profile");
            }
          }, 1000);
          return;
        }
      } catch (err) {
        // Fallback check in localStorage if backend is offline or returned error
        const foundUser = users.find(
          (user) => user.email.toLowerCase() === normalizedEmail && user.password === formData.password
        );

        if (foundUser) {
          localStorage.setItem("user", JSON.stringify(foundUser));
          localStorage.setItem("currentUser", JSON.stringify(foundUser));
          window.dispatchEvent(new Event("authChange"));
          setCurrentUser(foundUser);
          setMessage({ type: "success", text: `Welcome back, ${foundUser.name}! Redirecting...` });
          setTimeout(() => navigate("/profile"), 1000);
          return;
        }

        setMessage({ type: "danger", text: err.message || "Invalid email address or incorrect password." });
        return;
      }
    }

    // Registration Logic
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setMessage({ type: "danger", text: "Please fill in all required fields." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: "danger", text: "Please enter a valid email address." });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: "danger", text: "Password must be at least 6 characters long." });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "danger", text: "Passwords do not match! Please check again." });
      return;
    }

    if (!formData.agreeTerms) {
      setMessage({ type: "danger", text: "You must agree to the Terms of Service to create an account." });
      return;
    }

    const normalizedEmail = formData.email.trim().toLowerCase();

    const newUser = {
      name: formData.name.trim(),
      email: normalizedEmail,
      phone: formData.phone.trim() || "9817200000",
      password: formData.password,
      role: "User",
      createdAt: new Date().toISOString()
    };

    try {
      const res = await api.registerUser({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password
      });

      if (res && res.success) {
        await api.updateUserProfile({
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone
        }).catch((e) => console.warn("Profile sync warning:", e.message));

        const userObj = res.user || {};
        const loggedUser = {
          id: userObj.id || userObj._id || `${Date.now()}`,
          name: userObj.name || newUser.name,
          email: userObj.email || normalizedEmail,
          phone: userObj.phone || newUser.phone,
          role: userObj.role || "User",
          password: newUser.password
        };

        if (res.token) {
          localStorage.setItem("token", res.token);
        }
        localStorage.setItem("user", JSON.stringify(loggedUser));
        localStorage.setItem("currentUser", JSON.stringify(loggedUser));

        const updatedUsers = [...users.filter((u) => u.email.toLowerCase() !== normalizedEmail), loggedUser];
        localStorage.setItem("shopUsers", JSON.stringify(updatedUsers));
        window.dispatchEvent(new Event("authChange"));

        setCurrentUser(loggedUser);
        setMessage({ type: "success", text: `Account successfully registered! Logged in as ${loggedUser.name}! 🎉` });
        setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "", agreeTerms: true });

        setTimeout(() => navigate("/profile"), 1000);
        return;
      }
    } catch (err) {
      if (err.message && err.message.includes("already exists")) {
        setMessage({ type: "danger", text: "An account with this email address already exists. Please log in." });
        return;
      }

      // Offline fallback: save locally
      const updatedUsers = [...users.filter((u) => u.email.toLowerCase() !== normalizedEmail), newUser];
      localStorage.setItem("shopUsers", JSON.stringify(updatedUsers));
      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      window.dispatchEvent(new Event("authChange"));

      setCurrentUser(newUser);
      setMessage({ type: "success", text: `Account created! Logged in as ${newUser.name}! 🎉` });
      setFormData({ name: "", email: "", phone: "", password: "", confirmPassword: "", agreeTerms: true });

      setTimeout(() => navigate("/profile"), 1000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("authChange"));
    setCurrentUser(null);
    setMessage({ type: "info", text: "You have been successfully logged out." });
  };

  const handleSwitchAccount = () => {
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("authChange"));
    setCurrentUser(null);
    setIsLogin(false);
    setMessage({ type: "info", text: "Fill out the form below to register a new account." });
  };

  return (
    <div className="auth-page py-5">
      <div className="container d-flex justify-content-center">
        <div className="auth-card-container">
          
          {/* Card Header */}
          <div className="auth-card-header text-center mb-4">
            <div className="auth-badge-icon mb-2">
              <FaShieldAlt />
            </div>
            <h3 className="auth-title font-weight-bold">
              {currentUser ? "User Profile Account" : isLogin ? "Welcome Back!" : "Create an Account"}
            </h3>
            <p className="auth-subtitle text-muted small">
              {currentUser 
                ? "Manage your account and view past orders" 
                : isLogin 
                  ? "Log in to access your wishlist, cart & past orders" 
                  : "Join us today for exclusive discounts and fast checkout"}
            </p>
          </div>

          {/* IF USER IS LOGGED IN SHOW LOGGED IN ACCOUNT CARD & LOGOUT BUTTON */}
          {currentUser ? (
            <div className="logged-in-box card border-0 shadow-sm rounded-4 p-4 text-center">
              <div className="avatar-circle mx-auto mb-3 text-white font-weight-bold d-flex align-items-center justify-content-center">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <FaUser />}
              </div>
              
              <h4 className="font-weight-bold mb-1">{currentUser.name || "Valued Customer"}</h4>
              <p className="text-muted small mb-3">{currentUser.email}</p>
              
              <div className="mb-4">
                <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill font-weight-bold">
                  ● Account Active & Connected
                </span>
              </div>

              {message.text && (
                <div className={`alert alert-${message.type || "info"} rounded-3 mb-4 d-flex align-items-center justify-content-center`}>
                  {message.type === "success" && <FaCheckCircle className="me-2" />}
                  {message.type === "danger" && <FaExclamationTriangle className="me-2" />}
                  {message.text}
                </div>
              )}

              <div className="d-grid gap-2">
                <Link to="/profile" className="btn btn-primary rounded-pill py-2 font-weight-bold mb-2 d-flex align-items-center justify-content-center">
                  <FaUser className="me-2" /> View Profile & Orders <FaArrowRight className="ms-2 small" />
                </Link>
                
                <button
                  type="button"
                  className="btn btn-outline-primary rounded-pill py-2 font-weight-bold mb-2 d-flex align-items-center justify-content-center"
                  onClick={handleSwitchAccount}
                  id="auth-register-new-btn"
                >
                  <FaUserPlus className="me-2" /> Register Another / New Account
                </button>

                <Link to="/" className="btn btn-outline-secondary rounded-pill py-2 font-weight-bold mb-3 d-flex align-items-center justify-content-center">
                  <FaShoppingBag className="me-2" /> Continue Shopping
                </Link>

                <button
                  type="button"
                  className="btn btn-danger-custom rounded-pill py-2 font-weight-bold d-flex align-items-center justify-content-center"
                  onClick={handleLogout}
                  id="auth-logout-btn"
                >
                  <FaSignOutAlt className="me-2" /> Logout Account
                </button>
              </div>
            </div>
          ) : (
            /* IF USER IS NOT LOGGED IN SHOW LOGIN / REGISTRATION TABS & FORM */
            <div className="auth-card card border-0 shadow-sm rounded-4 p-4">
              
              {/* Tab Switcher */}
              <div className="auth-switch-container mb-4">
                <button
                  type="button"
                  className={`auth-switch-btn ${isLogin ? "active" : ""}`}
                  onClick={() => {
                    setIsLogin(true);
                    setMessage({ type: "", text: "" });
                  }}
                  id="tab-login-btn"
                >
                  <FaSignInAlt className="me-2" /> Login
                </button>
                <button
                  type="button"
                  className={`auth-switch-btn ${!isLogin ? "active" : ""}`}
                  onClick={() => {
                    setIsLogin(false);
                    setMessage({ type: "", text: "" });
                  }}
                  id="tab-register-btn"
                >
                  <FaUserPlus className="me-2" /> Register
                </button>
              </div>

              {/* Alert Notification Message */}
              {message.text && (
                <div className={`alert alert-${message.type} rounded-3 mb-4 d-flex align-items-center`}>
                  {message.type === "success" && <FaCheckCircle className="me-2 flex-shrink-0" />}
                  {message.type === "danger" && <FaExclamationTriangle className="me-2 flex-shrink-0" />}
                  <span>{message.text}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                
                {/* Full Name (Registration only) */}
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted mb-1">Full Name *</label>
                    <div className="input-group-custom">
                      <span className="input-icon"><FaUser /></span>
                      <input
                        type="text"
                        className="form-control auth-input"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div className="mb-3">
                  <label className="form-label font-weight-bold small text-muted mb-1">Email Address *</label>
                  <div className="input-group-custom">
                    <span className="input-icon"><FaEnvelope /></span>
                    <input
                      type="email"
                      className="form-control auth-input"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Phone Number (Registration only) */}
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted mb-1">Phone Number (Optional)</label>
                    <div className="input-group-custom">
                      <span className="input-icon"><FaPhone /></span>
                      <input
                        type="tel"
                        className="form-control auth-input"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9817200000"
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label font-weight-bold small text-muted mb-1">Password *</label>
                  <div className="input-group-custom position-relative">
                    <span className="input-icon"><FaLock /></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control auth-input pe-5"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder={isLogin ? "Enter your password" : "At least 6 characters"}
                      required
                    />
                    <button
                      type="button"
                      className="btn-toggle-pwd"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                      tabIndex="-1"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Registration only) */}
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label font-weight-bold small text-muted mb-1">Confirm Password *</label>
                    <div className="input-group-custom position-relative">
                      <span className="input-icon"><FaLock /></span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control auth-input pe-5"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="btn-toggle-pwd"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        title={showConfirmPassword ? "Hide password" : "Show password"}
                        tabIndex="-1"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Terms Checkbox (Registration) / Remember Me (Login) */}
                <div className="mb-4">
                  {!isLogin ? (
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="agreeTerms"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                      />
                      <label className="form-check-label small text-muted" htmlFor="agreeTerms">
                        I agree to the <Link to="/Term" className="text-decoration-none text-primary">Terms of Service</Link> & <Link to="/PrivacyCard" className="text-decoration-none text-primary">Privacy Policy</Link>
                      </label>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked />
                        <label className="form-check-label small text-muted" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="btn btn-auth-submit w-100 rounded-pill py-2 font-weight-bold text-white shadow-sm d-flex align-items-center justify-content-center"
                  id="auth-submit-btn"
                >
                  {isLogin ? (
                    <>
                      <FaSignInAlt className="me-2" /> Log In to Account
                    </>
                  ) : (
                    <>
                      <FaUserPlus className="me-2" /> Register New Account
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Helper Footer */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="small text-muted mb-0">
                  {isLogin ? "Don't have an account yet?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none font-weight-bold text-primary"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setMessage({ type: "", text: "" });
                    }}
                  >
                    {isLogin ? "Register Here" : "Login Here"}
                  </button>
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AuthPage;

