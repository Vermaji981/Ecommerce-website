import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FaUser, FaShoppingBag, FaSave, FaCheckCircle, FaSpinner, FaHistory, FaSignOutAlt } from 'react-icons/fa';

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

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
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
          api.getUserProfile(userEmail),
          api.getOrders()
        ]);

        if (!cancelled) {
          const mergedProfile = {
            name: profData?.name || storedUser?.name || '',
            email: userEmail,
            phone: profData?.phone || storedUser?.phone || '',
            address: profData?.address || storedUser?.address || '',
            city: profData?.city || storedUser?.city || '',
            pincode: profData?.pincode || storedUser?.pincode || ''
          };
          setProfile(mergedProfile);

          if (ordersData && Array.isArray(ordersData)) {
            const userOrders = ordersData.filter(o => o.email && String(o.email).trim().toLowerCase() === userEmail);
            setOrders(userOrders);
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
      } catch (e) {}

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

          {/* Right Column: Order History from Database */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                <h5 className="font-weight-bold mb-0 d-flex align-items-center">
                  <FaHistory className="text-primary me-2" /> Purchase History ({orders.length})
                </h5>
                <span className="badge bg-success">MongoDB Synced</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <FaShoppingBag className="mb-2" style={{ fontSize: '2.5rem', color: '#cbd5e1' }} />
                  <p>No past orders found in the database.</p>
                </div>
              ) : (
                <div className="order-history-list" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {orders.map((order, idx) => (
                    <div key={order._id || order.orderId || idx} className="order-card p-3 border rounded-3 mb-3 bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <span className="fw-bold text-primary me-2">{order.orderId || `ORD-#${idx + 1}`}</span>
                          <span className="badge bg-success">{order.status || order.paymentStatus || 'paid'}</span>
                        </div>
                        <span className="text-muted small">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <div className="small mb-2">
                        <strong>Transaction ID:</strong> <code className="text-dark">{order.transactionId || 'TXN-ONLINE'}</code>
                      </div>

                      <div className="small mb-2">
                        <strong>Payment Method:</strong> {order.paymentMethod || 'Card / Online Gateway'}
                      </div>

                      {order.items && order.items.length > 0 ? (
                        <div className="bg-light p-2 rounded mb-2">
                          {order.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="d-flex justify-content-between small">
                              <span>• {item.title} (x{item.quantity || 1})</span>
                              <span>{formatPrice(item.price * (item.quantity || 1))}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted small mb-2">• {order.title || 'Purchased Item'}</div>
                      )}

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <span className="text-muted small">Total Paid:</span>
                        <span className="fw-bold text-success h6 mb-0">
                          {formatPrice(order.totalAmount || order.total || 0)}
                        </span>
                      </div>
                    </div>
                  ))}
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
