import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../component/Loader";

function Users() {
  const [users, setUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => {
    fetchUsersAndOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsersAndOrders = async () => {
    try {
      setLoading(true);
      const [userRes, orderRes] = await Promise.all([
        api.get("/users"),
        api.get("/orders").catch(() => ({ data: { orders: [] } }))
      ]);

      const rawUsers = userRes.data?.users || userRes.data?.data || userRes.data;
      setUsers(Array.isArray(rawUsers) ? rawUsers : []);

      const rawOrders = orderRes.data?.orders || orderRes.data?.data || orderRes.data;
      setAllOrders(Array.isArray(rawOrders) ? rawOrders : []);
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Failed to load users", "error");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3500);
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "Admin" ? "User" : "Admin";
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map((u) => (u._id === userId ? response.data : u)));
      showMessage(`User role updated to ${newRole}`);
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to change role", "error");
    }
  };

  const deleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => String(u._id || u.id) !== String(userId)));
      showMessage("User account deleted");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to delete user", "error");
    }
  };

  const getUserOrders = (user) => {
    if (!user) return [];
    return allOrders.filter(
      (ord) =>
        String(ord.user?._id || ord.user) === String(user._id) ||
        (ord.email && user.email && ord.email.toLowerCase() === user.email.toLowerCase())
    );
  };

  if (loading) return <Loader text="Loading user directory..." />;

  const userOrders = viewingUser ? getUserOrders(viewingUser) : [];
  const userTotalSpent = userOrders.reduce((acc, ord) => acc + (Number(ord.totalAmount) || 0), 0);

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Accounts</h1>
          <p className="page-subtitle">
            Private Admin Dashboard: Inspect registered user accounts & customer order activity without user visibility
          </p>
        </div>
        <div className="badge badge-neutral font-semibold">
          Total Registered Users: {users.length}
        </div>
      </div>

      {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="card">
        <div className="table-responsive">
          {users.length > 0 ? (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const ordersCount = getUserOrders(u).length;
                  return (
                    <tr key={u._id}>
                      <td>
                        <div className="user-table-cell">
                          <div className="avatar font-bold">{u.name ? u.name.charAt(0).toUpperCase() : "U"}</div>
                          <div>
                            <strong>{u.name}</strong>
                            <div className="text-muted" style={{ fontSize: "0.78rem" }}>
                              {ordersCount} {ordersCount === 1 ? "order placed" : "orders placed"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || "N/A"}</td>
                      <td>
                        <span className={u.role === "Admin" ? "badge badge-primary" : "badge badge-neutral"}>
                          {u.role || "User"}
                        </span>
                      </td>
                      <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</td>
                      <td className="text-right action-buttons">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => setViewingUser(u)}
                          title="Inspect user activity and placed orders secretly"
                        >
                          👁️ View Activity
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => toggleRole(u._id, u.role)}
                          title="Toggle role between User and Admin"
                        >
                          Change to {u.role === "Admin" ? "User" : "Admin"}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteUser(u._id, u.name)}
                          title="Delete user account"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No registered users found in MongoDB database.</p>
            </div>
          )}
        </div>
      </div>

      {/* Secret Admin Inspection Modal for Selected User */}
      {viewingUser && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px"
          }}
          onClick={() => setViewingUser(null)}
        >
          <div
            className="modal-content-card"
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              maxWidth: "680px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              padding: "28px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div>
                <h4 className="fw-bold text-dark mb-1">User Account Details</h4>
                <p className="text-muted small mb-0">Confidential admin view (User has no access or notification)</p>
              </div>
              <button
                className="btn btn-sm btn-outline-secondary rounded-circle"
                style={{ width: "32px", height: "32px", padding: 0 }}
                onClick={() => setViewingUser(null)}
              >
                ✕
              </button>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3">
                  <div className="text-muted small">User Name</div>
                  <strong className="text-dark fs-6">{viewingUser.name || "N/A"}</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3">
                  <div className="text-muted small">Email Address</div>
                  <strong className="text-dark fs-6">{viewingUser.email || "N/A"}</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3">
                  <div className="text-muted small">Phone Number</div>
                  <strong className="text-dark fs-6">{viewingUser.phone || "Not provided"}</strong>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="p-3 bg-light rounded-3">
                  <div className="text-muted small">Total Spent</div>
                  <strong className="text-success fs-6">₹{userTotalSpent}</strong>
                </div>
              </div>
            </div>

            <h5 className="fw-bold text-dark mb-3">Orders Placed by User ({userOrders.length})</h5>
            {userOrders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-sm small">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((ord, idx) => (
                      <tr key={ord._id || idx}>
                        <td><strong>{ord.orderId || `ORD-${String(ord._id).slice(-6)}`}</strong></td>
                        <td>{ord.title || (Array.isArray(ord.items) ? ord.items.map((i) => i.name || i.title).join(", ") : "Product")}</td>
                        <td><strong className="text-primary">₹{ord.totalAmount || 0}</strong></td>
                        <td>
                          <span className={`badge ${ord.status === "paid" || ord.paymentStatus === "Completed" ? "bg-success" : "bg-warning text-dark"}`}>
                            {ord.orderStatus || ord.status || "Confirmed"}
                          </span>
                        </td>
                        <td>{ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : "Recent"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-3 bg-light rounded-3 text-center text-muted small">
                This user has not placed any orders yet.
              </div>
            )}

            <div className="mt-4 text-end">
              <button className="btn btn-secondary rounded-pill px-4" onClick={() => setViewingUser(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
