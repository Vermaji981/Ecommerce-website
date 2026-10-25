import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Loader from "../component/Loader";
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaUserCheck,
  FaUserSlash,
  FaEye,
  FaShoppingBag,
  FaHistory,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone
} from "react-icons/fa";

function Users() {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState({ text: "", type: "" });

  // Detail Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [userDetailsData, setUserDetailsData] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminUsers({
        page,
        limit: 10,
        search: searchTerm,
        status: statusFilter !== "all" ? statusFilter : undefined
      });

      const data = res.data;
      setUsers(Array.isArray(data.users) ? data.users : []);
      setTotalUsers(data.total || (data.users ? data.users.length : 0));
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error("Error fetching users:", err);
      showMessage(err.response?.data?.message || "Failed to load user list", "danger");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    const targetStatus = !user.isActive;
    const actionLabel = targetStatus ? "activate" : "deactivate";

    if (!window.confirm(`Are you sure you want to ${actionLabel} account for "${user.name}" (${user.email})?`)) {
      return;
    }

    try {
      await api.updateUserStatus(user._id, targetStatus);
      showMessage(`User "${user.name}" successfully ${targetStatus ? "activated" : "deactivated"}!`);
      // Update local state
      setUsers(users.map((u) => (u._id === user._id ? { ...u, isActive: targetStatus } : u)));
      if (userDetailsData && userDetailsData.user && userDetailsData.user._id === user._id) {
        setUserDetailsData({
          ...userDetailsData,
          user: { ...userDetailsData.user, isActive: targetStatus }
        });
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to update account status", "danger");
    }
  };

  const openUserDetails = async (user) => {
    setSelectedUser(user);
    setLoadingDetails(true);
    setUserDetailsData(null);
    try {
      const res = await api.getAdminUserById(user._id);
      setUserDetailsData(res.data);
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to load user details", "danger");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
    setUserDetailsData(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="users-page p-3 p-md-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <FaUsers className="text-primary" /> User Accounts & Management
          </h1>
          <p className="text-muted small mb-0">
            Monitor registered customer accounts, order history, activity logs, and account statuses
          </p>
        </div>
        <div className="badge bg-primary fs-6 py-2 px-3">
          Total Users: {totalUsers}
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show mb-4`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ text: "", type: "" })}></button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
        <div className="card-body p-3">
          <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
            <div className="col-12 col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by User Name, Email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaFilter className="text-muted" />
                </span>
                <select
                  className="form-select border-start-0"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All Account Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Deactivated Only</option>
                </select>
              </div>
            </div>

            <div className="col-6 col-md-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary w-100">
                Filter Users
              </button>
              {(searchTerm || statusFilter !== "all") && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setPage(1);
                  }}
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5">
              <Loader text="Loading registered user accounts..." />
            </div>
          ) : users.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">User ID</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Account Status</th>
                    <th>Last Active</th>
                    <th className="text-center">Orders</th>
                    <th className="text-center">Products Added</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="ps-3">
                        <code className="text-secondary small">{String(u._id).slice(-8)}</code>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{u.name}</div>
                        <span className="badge bg-light text-secondary border small text-capitalize">
                          {u.role || "customer"}
                        </span>
                      </td>
                      <td>
                        <a href={`mailto:${u.email}`} className="text-decoration-none text-dark small">
                          {u.email}
                        </a>
                      </td>
                      <td className="small text-muted">{formatDate(u.createdAt)}</td>
                      <td>
                        {u.isActive ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                            ● Active
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                            ✕ Deactivated
                          </span>
                        )}
                      </td>
                      <td className="small text-muted">{formatDate(u.lastActiveTime || u.lastActive)}</td>
                      <td className="text-center">
                        <span className="badge bg-primary-subtle text-primary fw-bold px-2 py-1">
                          {u.totalOrders || 0}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-secondary-subtle text-dark fw-bold px-2 py-1">
                          {u.totalProductsAdded || 0}
                        </span>
                      </td>
                      <td className="text-end pe-3">
                        <div className="d-flex justify-content-end gap-1">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                            title="View Full User Details, Order History & Activity"
                            onClick={() => openUserDetails(u)}
                          >
                            <FaEye /> Inspect
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${u.isActive ? "btn-outline-danger" : "btn-outline-success"}`}
                            title={u.isActive ? "Deactivate User Account" : "Activate User Account"}
                            onClick={() => handleToggleStatus(u)}
                          >
                            {u.isActive ? <FaUserSlash /> : <FaUserCheck />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <FaUsers className="fs-1 mb-2 text-secondary opacity-50" />
              <p className="mb-0">No users found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center">
            <span className="small text-muted">
              Page {page} of {totalPages} ({totalUsers} total users)
            </span>
            <div className="btn-group btn-group-sm">
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal / Drawer */}
      {selectedUser && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.65)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header bg-light border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 bg-primary text-white rounded-circle">
                    <FaUsers />
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">User Profile & Activity Audit</h5>
                    <small className="text-muted">User ID: {selectedUser._id}</small>
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={closeUserDetails}></button>
              </div>

              <div className="modal-body p-4">
                {loadingDetails ? (
                  <div className="py-4 text-center">
                    <Loader text="Fetching user order history and activity logs..." />
                  </div>
                ) : userDetailsData ? (
                  <>
                    {/* User Profile Summary */}
                    <div className="card border rounded-3 p-3 mb-4 bg-light">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="text-muted small">Full Name</div>
                          <div className="fw-bold fs-5 text-dark">{userDetailsData.user?.name}</div>
                          <div className="text-muted small mt-2 d-flex align-items-center gap-1">
                            <FaEnvelope /> {userDetailsData.user?.email}
                          </div>
                          {userDetailsData.user?.phone && (
                            <div className="text-muted small d-flex align-items-center gap-1">
                              <FaPhone /> {userDetailsData.user?.phone}
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <div className="text-muted small">Account Status</div>
                          <div className="mb-2">
                            {userDetailsData.user?.isActive ? (
                              <span className="badge bg-success">Active Account</span>
                            ) : (
                              <span className="badge bg-danger">Deactivated Account</span>
                            )}
                            <span className="badge bg-secondary ms-2 text-capitalize">
                              {userDetailsData.user?.role || "customer"}
                            </span>
                          </div>
                          <div className="small text-muted d-flex align-items-center gap-1">
                            <FaCalendarAlt /> Registered: {formatDate(userDetailsData.user?.createdAt)}
                          </div>
                          <div className="small text-muted d-flex align-items-center gap-1 mt-1">
                            <FaHistory /> Last Active: {formatDate(userDetailsData.user?.lastActiveTime)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-top d-flex gap-2">
                        <button
                          type="button"
                          className={`btn btn-sm ${userDetailsData.user?.isActive ? "btn-danger" : "btn-success"}`}
                          onClick={() => handleToggleStatus(userDetailsData.user)}
                        >
                          {userDetailsData.user?.isActive ? "Deactivate Account" : "Activate Account"}
                        </button>
                      </div>
                    </div>

                    {/* Order History Section */}
                    <div className="mb-4">
                      <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <FaShoppingBag className="text-primary" /> Order History ({userDetailsData.orders?.length || 0})
                      </h6>
                      {userDetailsData.orders && userDetailsData.orders.length > 0 ? (
                        <div className="table-responsive border rounded-3">
                          <table className="table table-sm table-hover mb-0">
                            <thead className="table-light">
                              <tr>
                                <th className="ps-3">Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Payment</th>
                                <th>Fulfillment</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userDetailsData.orders.map((ord) => (
                                <tr key={ord._id}>
                                  <td className="ps-3 fw-semibold text-primary">
                                    {ord.orderId || `ORD-${String(ord._id).slice(-6)}`}
                                  </td>
                                  <td className="small">{formatDate(ord.createdAt)}</td>
                                  <td className="fw-bold">₹{ord.totalAmount || 0}</td>
                                  <td>
                                    <span className={`badge ${ord.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                      {ord.paymentStatus || 'Pending'}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="badge bg-secondary">{ord.orderStatus || 'Confirmed'}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-muted small fst-italic">No past orders placed by this user.</p>
                      )}
                    </div>

                    {/* User Activity History */}
                    <div>
                      <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                        <FaHistory className="text-primary" /> User Activity History ({userDetailsData.activities?.length || 0})
                      </h6>
                      {userDetailsData.activities && userDetailsData.activities.length > 0 ? (
                        <div className="activity-list border rounded-3 p-2 bg-light" style={{ maxHeight: "250px", overflowY: "auto" }}>
                          {userDetailsData.activities.map((act) => (
                            <div key={act._id} className="p-2 border-bottom d-flex justify-content-between align-items-start gap-2 bg-white rounded mb-1">
                              <div>
                                <span className="badge bg-secondary-subtle text-dark border small me-2">
                                  {act.actionType}
                                </span>
                                <span className="small text-dark fw-semibold">{act.description}</span>
                              </div>
                              <span className="small text-muted" style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                                {formatDate(act.createdAt)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted small fst-italic">No activity recorded for this user yet.</p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-danger">Failed to load details.</p>
                )}
              </div>

              <div className="modal-footer bg-light border-top">
                <button type="button" className="btn btn-secondary btn-sm" onClick={closeUserDetails}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
