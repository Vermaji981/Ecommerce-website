import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Statcard from "../component/Statcard";
import Loader from "../component/Loader";

function Deshboard() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    totalCustomers: 0,
    totalAdmins: 0,
    orders: 0,
    totalValue: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    outOfStockCount: 0,
    averagePrice: 0,
    categoryBreakdown: {},
    recentProducts: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/dashboard");
      const data = response.data || {};
      const statsObj = data.stats || {};

      setStats({
        products: data.products !== undefined ? data.products : (statsObj.totalProducts || 0),
        users: data.users !== undefined ? data.users : (statsObj.totalUsers || 0),
        totalCustomers: data.totalCustomers !== undefined ? data.totalCustomers : (statsObj.totalCustomers || 0),
        totalAdmins: data.totalAdmins !== undefined ? data.totalAdmins : (statsObj.totalAdmins || 0),
        orders: data.orders !== undefined ? data.orders : (statsObj.totalOrders || 0),
        totalValue: data.totalValue !== undefined ? data.totalValue : (statsObj.totalValue || 0),
        totalRevenue: data.totalRevenue !== undefined ? data.totalRevenue : (statsObj.totalRevenue || 0),
        lowStockProducts: data.lowStockProducts !== undefined ? data.lowStockProducts : (statsObj.lowStockProducts || 0),
        outOfStockCount: data.outOfStockCount !== undefined ? data.outOfStockCount : (statsObj.outOfStockCount || 0),
        averagePrice: data.averagePrice !== undefined ? data.averagePrice : (statsObj.averagePrice || 0),
        categoryBreakdown: data.categoryBreakdown || {},
        recentProducts: Array.isArray(data.recentProducts) ? data.recentProducts : [],
        recentUsers: Array.isArray(data.recentUsers) 
          ? data.recentUsers 
          : (Array.isArray(data.recentCustomers) ? data.recentCustomers : []),
      });
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Calculating live product statistics & loading registered users..." />;
  }

  const categoryEntries = Object.entries(stats.categoryBreakdown || {});

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Real-time calculations for added products & registered user accounts</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={fetchDashboardStats}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
            </svg>
            Refresh Calculations
          </button>
          <Link to="/add-product" className="btn btn-primary">
            + Add New Product
          </Link>
          <Link to="/users" className="btn btn-outline-primary">
            👥 View All Users
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Main Calculated Metrics Stat Cards */}
      <div className="stats-grid">
        <Statcard
          title="Total Added Products"
          value={stats.products}
          color="indigo"
          trend="Live DB Count"
          subtext="Total items active in store"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          }
        />

        <Statcard
          title="Registered Users"
          value={stats.users}
          color="emerald"
          trend={`${stats.totalCustomers} Customers | ${stats.totalAdmins} Admins`}
          subtext="Total registered user accounts"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
        />

        <Statcard
          title="Total Inventory Value"
          value={`₹${(stats.totalValue || 0).toLocaleString()}`}
          color="amber"
          trend="Calculated Live"
          subtext="Formula: Price × Stock quantity"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          }
        />

        <Statcard
          title="Stock & Pricing Metrics"
          value={`${stats.lowStockProducts} Low Stock`}
          color="rose"
          trend={`Avg Price: ₹${stats.averagePrice}`}
          subtext={`${stats.outOfStockCount} items out of stock`}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          }
        />
      </div>

      {/* Category Breakdown Calculation Bar */}
      {categoryEntries.length > 0 && (
        <div className="card mb-4" style={{ marginBottom: "1.5rem" }}>
          <div className="card-header">
            <h3>Calculated Products by Category</h3>
            <p className="card-subtitle">Live product distribution across store categories</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", padding: "0.5rem 0" }}>
            {categoryEntries.map(([catName, count]) => (
              <div 
                key={catName} 
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "10px",
                  padding: "0.55rem 1.1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  fontSize: "0.9rem",
                  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)"
                }}
              >
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{catName}:</span>
                <span className="badge badge-primary" style={{ fontWeight: 700 }}>{count} items</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: 2 columns for Registered Users & Added Products */}
      <div className="dashboard-grid-2col mb-4">
        {/* Registered Users Section */}
        <div className="card">
          <div className="card-header flex-between">
            <div>
              <h3>Registered Users</h3>
              <p className="card-subtitle">Users registered in MongoDB database</p>
            </div>
            <Link to="/users" className="link-btn">View All ({stats.users}) →</Link>
          </div>

          <div className="table-responsive">
            {stats.recentUsers && stats.recentUsers.length > 0 ? (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email / Contact</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((u) => (
                    <tr key={u._id}>
                      <td className="font-semibold flex-align">
                        <div 
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: u.role === "Admin" || u.role === "admin" ? "#6366f1" : "#10b981",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "0.85rem",
                            marginRight: "8px"
                          }}
                        >
                          {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span>{u.name || "User"}</span>
                      </td>
                      <td>
                        <div>{u.email}</div>
                        {u.phone && <small style={{ color: "var(--text-muted, #64748b)" }}>{u.phone}</small>}
                      </td>
                      <td>
                        <span className={u.role === "Admin" || u.role === "admin" ? "badge badge-primary" : "badge badge-neutral"}>
                          {u.role || "customer"}
                        </span>
                      </td>
                      <td>
                        <small>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No registered users found yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Calculated Added Products Section */}
        <div className="card">
          <div className="card-header flex-between">
            <div>
              <h3>Added Products & Calculations</h3>
              <p className="card-subtitle">Recent products with live stock & price calculation</p>
            </div>
            <Link to="/products" className="link-btn">View All ({stats.products}) →</Link>
          </div>

          <div className="table-responsive">
            {stats.recentProducts && stats.recentProducts.length > 0 ? (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProducts.map((p) => {
                    const price = Number(p.price) || 0;
                    const stock = p.stock !== undefined && p.stock !== null ? Number(p.stock) : 10;
                    const itemTotal = price * stock;

                    return (
                      <tr key={p._id}>
                        <td className="font-semibold flex-align">
                          <img
                            src={p.image || (Array.isArray(p.images) && p.images[0]) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                            alt={p.name || p.title}
                            className="table-thumb"
                            style={{ width: "36px", height: "36px", borderRadius: "6px", objectFit: "cover" }}
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"; }}
                          />
                          <span>{p.name || p.title}</span>
                        </td>
                        <td>
                          <span className="badge badge-neutral">
                            {typeof p.category === 'object' && p.category !== null 
                              ? (p.category.name || "General") 
                              : (p.catogries || p.category || "General")}
                          </span>
                        </td>
                        <td className="price-tag">₹{price}</td>
                        <td>
                          <span className={stock > 5 ? "badge badge-success" : stock > 0 ? "badge badge-amber" : "badge badge-danger"}>
                            {stock} in stock
                          </span>
                        </td>
                        <td className="font-semibold" style={{ color: "var(--color-emerald, #10b981)" }}>
                          ₹{itemTotal.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>No products added yet.</p>
                <Link to="/add-product" className="btn btn-sm btn-primary">Add First Product</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="card">
        <div className="card-header">
          <h3>Quick Management Actions</h3>
          <p className="card-subtitle">Shortcuts to manage products, users, and storefront</p>
        </div>

        <div className="quick-actions-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <Link to="/add-product" className="quick-action-item">
            <div className="qa-icon icon-indigo">➕</div>
            <div>
              <h4>Add New Product</h4>
              <p>Add new products & auto-calculate stock/price</p>
            </div>
          </Link>

          <Link to="/products" className="quick-action-item">
            <div className="qa-icon icon-emerald">📦</div>
            <div>
              <h4>Manage Products ({stats.products})</h4>
              <p>Edit, delete, or update inventory stock</p>
            </div>
          </Link>

          <Link to="/users" className="quick-action-item">
            <div className="qa-icon icon-amber">👥</div>
            <div>
              <h4>Manage Registered Users ({stats.users})</h4>
              <p>View registered users, change roles or permissions</p>
            </div>
          </Link>

          <Link to="/" target="_blank" className="quick-action-item highlight-qa">
            <div className="qa-icon icon-rose">🌐</div>
            <div>
              <h4>Open Main Store</h4>
              <p>View live customer storefront</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Deshboard;
