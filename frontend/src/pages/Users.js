import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../component/Loader";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      const raw = response.data?.users || response.data?.data || response.data;
      setUsers(Array.isArray(raw) ? raw : []);
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
      setUsers(users.map(u => u._id === userId ? response.data : u));
      showMessage(`User role updated to ${newRole}`);
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to change role", "error");
    }
  };

  const deleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => String(u._id || u.id) !== String(userId)));
      showMessage("User account deleted");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to delete user", "error");
    }
  };

  if (loading) return <Loader text="Loading user directory..." />;

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Accounts</h1>
          <p className="page-subtitle">Manage system users, view registered login details & update permissions</p>
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
                  <th>Last Login</th>
                  <th>Joined Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-table-cell">
                        <div className="avatar font-bold">{u.name ? u.name.charAt(0).toUpperCase() : "U"}</div>
                        <div>
                          <strong>{u.name}</strong>
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
                    <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "N/A"}</td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</td>
                    <td className="text-right action-buttons">
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
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No registered users found in MongoDB database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Users;
