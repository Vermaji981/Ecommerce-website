import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  FaUser,
  FaShoppingBag,
  FaSave,
  FaCheckCircle,
  FaSpinner,
  FaHistory,
  FaSignOutAlt,
  FaTruck,
  FaBox,
  FaTimesCircle,
  FaChevronDown,
  FaChevronUp,
  FaBan,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  });

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("lastActivityTime");
    window.dispatchEvent(new Event("authChange"));
    navigate("/auth");
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      try {
        let storedUser = null;
        try {
          const raw = localStorage.getItem("currentUser");
          if (raw) storedUser = JSON.parse(raw);
        } catch (e) {
          storedUser = null;
        }

        if (!storedUser || !storedUser.email) {
          if (!cancelled) {
            setIsLoading(false);
            navigate("/auth");
          }
          return;
        }

        const userEmail = String(storedUser.email).trim().toLowerCase();

        const [profData, ordersData] = await Promise.all([
          api.getUserProfile(),
          api.getOrders()
        ]);

        if (!cancelled) {
          const mergedProfile = {
            name: profData?.name || storedUser?.name || '',
            email: userEmail,
            phone: profData?.phone || storedUser?.phone || '',
            address: profData?.address || (profData?.addresses && profData?.addresses[0]?.street) || storedUser?.address || '',
            city: profData?.city || (profData?.addresses && profData?.addresses[0]?.city) || storedUser?.city || '',
            state: profData?.state || (profData?.addresses && profData?.addresses[0]?.state) || storedUser?.state || '',
            pincode: profData?.pincode || profData?.postalCode || (profData?.addresses && profData?.addresses[0]?.postalCode) || storedUser?.pincode || ''
          };
          setProfile(mergedProfile);

          if (ordersData && Array.isArray(ordersData)) {
            setOrders(ordersData);
          }
        }
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);

    try {
      const res = await api.updateUserProfile(profile);
      const updatedProfile = (res && res.profile) ? res.profile : profile;

      let storedUser = {};
      try {
        const raw = localStorage.getItem("currentUser");
        if (raw) storedUser = JSON.parse(raw);
      } catch (e) { }

      const nextUser = { ...storedUser, ...updatedProfile };
      localStorage.setItem("currentUser", JSON.stringify(nextUser));
      window.dispatchEvent(new Event("authChange"));

      setIsSaving(false);
      setSuccessMsg('Profile updated and stored in MongoDB database!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setIsSaving(false);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const renderOrderShippingAddress = (order) => {
    if (!order || !order.shippingAddress) {
      return <span className="text-muted fst-italic">Shipping details not available</span>;
    }

    if (typeof order.shippingAddress === 'string') {
      const cleanAddr = order.shippingAddress.replace(/^,\s*|,\s*$/g, '').trim();
      if (!cleanAddr) {
        return <span className="text-muted fst-italic">Shipping details not available</span>;
      }
      return <span>{cleanAddr}</span>;
    }

    const sa = order.shippingAddress;
    const recipient = sa.fullName || sa.name || order.customerName;
    const phone = sa.phone || order.phone;
    const street = sa.street || sa.address;
    const city = sa.city;
    const state = sa.state;
    const postalCode = sa.postalCode || sa.pincode;
    const country = sa.country || 'India';

    if (!street && !city && !state && !postalCode) {
      return <span className="text-muted fst-italic">Shipping details not available</span>;
    }

    return (
      <div>
        {recipient && (
          <div className="fw-semibold">
            {recipient} {phone ? <span className="text-muted fw-normal">({phone})</span> : null}
          </div>
        )}
        {street && <div>{street}</div>}
        {(city || state || postalCode) && (
          <div>
            {[city, state].filter(Boolean).join(', ')} {postalCode ? `- ${postalCode}` : ''}
          </div>
        )}
        {country && <div className="text-muted" style={{ fontSize: '0.75rem' }}>{country}</div>}
      </div>
    );
  };

  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt("Please state the reason for cancelling your order:");
    if (reason === null) return;

    try {
      setCancellingOrderId(orderId);
      const res = await api.cancelCustomerOrder(orderId, reason || "Cancelled by customer");
      const updated = res.data.order;
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, ...updated } : o)));
      setSuccessMsg("Your order has been cancelled successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getOrderStatusStep = (status) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Confirmed":
        return 1;
      case "Processing":
        return 2;
      case "Shipped":
      case "Out for Delivery":
        return 3;
      case "Delivered":
        return 4;
      case "Cancelled":
        return -1;
      case "Returned":
        return -2;
      default:
        return 1;
    }
  };

  const getFulfillmentBadgeClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-success text-white";
      case "Shipped":
      case "Out for Delivery":
        return "bg-info text-dark";
      case "Processing":
        return "bg-primary text-white";
      case "Confirmed":
        return "bg-secondary text-white";
      case "Cancelled":
      case "Returned":
        return "bg-danger text-white";
      case "Pending":
      default:
        return "bg-warning text-dark";
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <FaSpinner className="spinner-icon text-primary" style={{ fontSize: '2.5rem' }} />
        <h4 className="mt-3">Loading profile & database history...</h4>
      </div>
    );
  }

  return (
    <div className="profile-page py-5 bg-light min-vh-100">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="font-weight-bold mb-0">User Account & Database Orders</h2>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger rounded-pill px-3 py-2 font-weight-bold d-flex align-items-center"
            title="Log out of your account"
          >
            <FaSignOutAlt className="me-2" /> Logout
          </button>
        </div>

        {successMsg && (
          <div className="alert alert-success rounded-3 d-flex align-items-center mb-4">
            <FaCheckCircle className="me-2" /> {successMsg}
          </div>
        )}

        <div className="row">
          {/* Left Column: User Profile Form */}
          <div className="col-lg-5 mb-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{ width: '50px', height: '50px', fontSize: '1.4rem' }}
                  >
                    <FaUser />
                  </div>
                  <div>
                    <h5 className="font-weight-bold mb-0">{profile.name || 'User Profile'}</h5>
                    <span className="text-muted small">Connected to MongoDB</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-sm btn-light text-danger rounded-pill px-2 py-1 font-weight-bold d-flex align-items-center"
                  title="Logout"
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </button>
              </div>

              <form onSubmit={handleProfileSave}>
                <div className="mb-3">
                  <label className="form-label font-weight-bold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    placeholder="Happy Verma"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label font-weight-bold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="happy@example.com"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label font-weight-bold">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="9817200000"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label font-weight-bold">Default Delivery Address</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    placeholder="Address..."
                  />
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label font-weight-bold">City</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={profile.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label font-weight-bold">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      name="pincode"
                      value={profile.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-pill font-weight-bold py-2"
                  disabled={isSaving}
                >
                  <FaSave className="me-2" /> {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Customer Orders & Visual Status Tracking */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h5 className="font-weight-bold mb-0 d-flex align-items-center">
                  <FaShoppingBag className="text-primary me-2" /> My Orders & Delivery Tracking ({orders.length})
                </h5>
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  Live MongoDB Tracking
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <FaShoppingBag className="mb-2" style={{ fontSize: '3rem', color: '#cbd5e1' }} />
                  <h5>No orders placed yet</h5>
                  <p className="small">Your purchases and delivery progress will appear here.</p>
                </div>
              ) : (
                <div className="order-history-list" style={{ maxHeight: '650px', overflowY: 'auto' }}>
                  {orders.map((order, idx) => {
                    const step = getOrderStatusStep(order.orderStatus);
                    const isCancelled = order.orderStatus === 'Cancelled';
                    const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);
                    const isExpanded = expandedOrderId === (order._id || order.orderId);

                    return (
                      <div
                        key={order._id || order.orderId || idx}
                        className="order-card p-3 border rounded-3 mb-3 bg-white shadow-sm"
                      >
                        {/* Top Summary */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
                          <div>
                            <span className="fw-bold text-primary me-2">
                              {order.orderId || `ORD-#${idx + 1}`}
                            </span>
                            <span className={`badge ${getFulfillmentBadgeClass(order.orderStatus)} me-1`}>
                              {order.orderStatus || 'Confirmed'}
                            </span>
                            <span
                              className={`badge ${order.paymentStatus === 'Paid'
                                ? 'bg-success text-white'
                                : 'bg-warning text-dark'
                                }`}
                            >
                              Payment: {order.paymentStatus || 'Pending'}
                            </span>
                          </div>
                          <span className="text-muted small">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>

                        {/* Visual 4-Step Delivery Progress Tracker */}
                        {!isCancelled ? (
                          <div className="order-tracker my-3 px-2 py-2 bg-light rounded-3">
                            <div className="d-flex justify-content-between text-center position-relative">
                              {/* Step 1 */}
                              <div className="tracker-step flex-fill">
                                <div
                                  className={`rounded-circle mx-auto d-flex align-items-center justify-content-center text-white mb-1 ${step >= 1 ? 'bg-success' : 'bg-secondary'
                                    }`}
                                  style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}
                                >
                                  ✓
                                </div>
                                <div className="small fw-semibold text-dark" style={{ fontSize: '0.75rem' }}>
                                  Confirmed
                                </div>
                              </div>

                              {/* Step 2 */}
                              <div className="tracker-step flex-fill">
                                <div
                                  className={`rounded-circle mx-auto d-flex align-items-center justify-content-center text-white mb-1 ${step >= 2 ? 'bg-primary' : 'bg-secondary'
                                    }`}
                                  style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}
                                >
                                  <FaBox />
                                </div>
                                <div className="small fw-semibold text-dark" style={{ fontSize: '0.75rem' }}>
                                  Processing
                                </div>
                              </div>

                              {/* Step 3 */}
                              <div className="tracker-step flex-fill">
                                <div
                                  className={`rounded-circle mx-auto d-flex align-items-center justify-content-center text-white mb-1 ${step >= 3 ? 'bg-info' : 'bg-secondary'
                                    }`}
                                  style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}
                                >
                                  <FaTruck />
                                </div>
                                <div className="small fw-semibold text-dark" style={{ fontSize: '0.75rem' }}>
                                  Shipped
                                </div>
                              </div>

                              {/* Step 4 */}
                              <div className="tracker-step flex-fill">
                                <div
                                  className={`rounded-circle mx-auto d-flex align-items-center justify-content-center text-white mb-1 ${step >= 4 ? 'bg-success' : 'bg-secondary'
                                    }`}
                                  style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}
                                >
                                  <FaCheckCircle />
                                </div>
                                <div className="small fw-semibold text-dark" style={{ fontSize: '0.75rem' }}>
                                  Delivered
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center my-2">
                            <FaTimesCircle className="me-2" />
                            <span>
                              This order was cancelled. {order.cancelReason ? `Reason: "${order.cancelReason}"` : ''}
                            </span>
                          </div>
                        )}

                        {/* Items List */}
                        {order.items && order.items.length > 0 ? (
                          <div className="bg-light p-2 rounded mb-2">
                            {order.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="d-flex justify-content-between small py-1 border-bottom-dashed">
                                <span>• {item.name || item.title} (x{item.quantity || 1})</span>
                                <span className="fw-semibold">
                                  {formatPrice((item.price || 0) * (item.quantity || 1))}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-muted small mb-2">• {order.title || 'Purchased Store Item'}</div>
                        )}

                        {/* Delivery Shipping Address Details */}
                        <div className="order-shipping-details p-2 rounded bg-light mb-2 border-start border-3 border-primary">
                          <div className="d-flex align-items-center gap-1 small fw-bold text-dark mb-1">
                            <FaMapMarkerAlt className="text-primary" /> Delivery Shipping Details:
                          </div>
                          <div className="small text-dark">
                            {renderOrderShippingAddress(order)}
                          </div>
                        </div>

                        {/* Footer & Actions */}
                        <div className="d-flex flex-wrap justify-content-between align-items-center pt-2 border-top gap-2">
                          <div>
                            <span className="text-muted small me-1">Total:</span>
                            <span className="fw-bold text-success fs-6">
                              {formatPrice(order.totalAmount || order.total || 0)}
                            </span>
                          </div>

                          <div className="d-flex gap-2">
                            {order.statusHistory && order.statusHistory.length > 0 && (
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                                onClick={() =>
                                  setExpandedOrderId(isExpanded ? null : (order._id || order.orderId))
                                }
                              >
                                <FaHistory /> Timeline {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            )}

                            {canCancel && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                disabled={cancellingOrderId === order._id}
                                onClick={() => handleCancelOrder(order._id)}
                              >
                                <FaBan /> {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Status History Accordion */}
                        {isExpanded && order.statusHistory && (
                          <div className="mt-3 pt-3 border-top bg-light p-3 rounded">
                            <h6 className="small fw-bold text-dark mb-2 d-flex align-items-center gap-1">
                              <FaHistory className="text-primary" /> Delivery Status History
                            </h6>
                            <div className="small">
                              {order.statusHistory.map((sh, sIdx) => (
                                <div key={sIdx} className="d-flex justify-content-between mb-1 pb-1 border-bottom">
                                  <div>
                                    <span className="badge bg-secondary me-2">{sh.status}</span>
                                    {sh.note && <span className="text-muted fst-italic">"{sh.note}"</span>}
                                  </div>
                                  <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                                    {new Date(sh.changedAt).toLocaleString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
