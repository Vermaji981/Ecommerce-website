import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../component/Loader";
import {
  FaUsers,
  FaUserCheck,
  FaBoxOpen,
  FaShoppingBag,
  FaHourglassHalf,
  FaCogs,
  FaShippingFast,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaSyncAlt,
  FaPlus,
  FaHistory,
  FaArrowRight
} from "react-icons/fa";

function Deshboard() {
  const [stats, setStats] = useState({
    totalRegisteredUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    confirmedOrders: 0,
    outForDeliveryOrders: 0,
    returnedOrders: 0,
    totalSales: 0,
    totalValue: 0,
    lowStockProducts: 0,
    outOfStockCount: 0,
    recentOrders: [],
    recentUsers: [],
    recentActivities: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/dashboard");
      const data = response.data || {};
      const s = data.stats || data;

      setStats({
        totalRegisteredUsers: s.totalRegisteredUsers !== undefined ? s.totalRegisteredUsers : (data.users || 0),
        activeUsers: s.activeUsers !== undefined ? s.activeUsers : (s.totalRegisteredUsers || 0),
        totalProducts: s.totalProducts !== undefined ? s.totalProducts : (data.products || 0),
        totalOrders: s.totalOrders !== undefined ? s.totalOrders : (data.orders || 0),
        pendingOrders: s.pendingOrders || 0,
        processingOrders: s.processingOrders || 0,
        shippedOrders: s.shippedOrders || 0,
        deliveredOrders: s.deliveredOrders || 0,
        cancelledOrders: s.cancelledOrders || 0,
        confirmedOrders: s.confirmedOrders || 0,
        outForDeliveryOrders: s.outForDeliveryOrders || 0,
        returnedOrders: s.returnedOrders || 0,
        totalSales: Number(s.totalSales !== undefined ? s.totalSales : (s.totalRevenue || 0)),
        totalValue: Number(s.totalValue || 0),
        lowStockProducts: Number(s.lowStockProducts || 0),
        outOfStockCount: Number(s.outOfStockCount || 0),
        recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
        recentUsers: Array.isArray(data.recentUsers) ? data.recentUsers : [],
        recentActivities: Array.isArray(data.recentActivities) ? data.recentActivities : []
      });
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.response?.data?.message || "Failed to load live dashboard statistics from database.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  const getOrderStatusBadgeClass = (status) => {
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

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-success text-white";
      case "Failed":
        return "bg-danger text-white";
      case "Refunded":
        return "bg-info text-dark";
      case "Pending":
      default:
        return "bg-warning text-dark";
    }
  };

  if (loading) {
    return <Loader text="Calculating live metrics from MongoDB Atlas..." />;
  }

  return (
    <div className="dashboard-page p-3 p-md-4">
      {/* Top Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold mb-1 text-dark">Executive Admin Dashboard</h1>
          <p className="text-muted small mb-0">
            Real-time MongoDB monitoring for user activity, product inventory, sales & order fulfillment
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2" onClick={fetchDashboardStats}>
            <FaSyncAlt /> Refresh
          </button>
          <Link to="/admin/add-product" className="btn btn-primary btn-sm d-flex align-items-center gap-2">
            <FaPlus /> Add Product
          </Link>
          <Link to="/admin/orders" className="btn btn-dark btn-sm d-flex align-items-center gap-2">
            <FaShoppingBag /> Manage Orders
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* 1. Core Primary Dashboard Statistics (Top Row) */}
      <div className="row g-3 mb-4">
        {/* Total Registered Users */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Registered Users</span>
                <h3 className="fw-bold my-2 text-dark">{stats.totalRegisteredUsers}</h3>
                <span className="badge bg-success-subtle text-success border border-success-subtle small d-inline-flex align-items-center gap-1">
                  <FaUserCheck /> {stats.activeUsers} Active Accounts
                </span>
              </div>
              <div className="p-3 rounded-circle bg-primary-subtle text-primary fs-5">
                <FaUsers />
              </div>
            </div>
            <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center small text-muted">
              <span>Customer directory</span>
              <Link to="/admin/users" className="text-primary text-decoration-none fw-semibold">
                View Users →
              </Link>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Products</span>
                <h3 className="fw-bold my-2 text-dark">{stats.totalProducts}</h3>
                <span className="badge bg-info-subtle text-info border border-info-subtle small">
                  {stats.lowStockProducts} Low Stock | {stats.outOfStockCount} Out
                </span>
              </div>
              <div className="p-3 rounded-circle bg-info-subtle text-info fs-5">
                <FaBoxOpen />
              </div>
            </div>
            <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center small text-muted">
              <span>Store inventory</span>
              <Link to="/admin/products" className="text-info text-decoration-none fw-semibold">
                Manage Catalog →
              </Link>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Total Orders</span>
                <h3 className="fw-bold my-2 text-dark">{stats.totalOrders}</h3>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle small">
                  {stats.processingOrders + stats.shippedOrders} In Transit / Process
                </span>
              </div>
              <div className="p-3 rounded-circle bg-warning-subtle text-warning fs-5">
                <FaShoppingBag />
              </div>
            </div>
            <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center small text-muted">
              <span>All customer orders</span>
              <Link to="/admin/orders" className="text-warning text-decoration-none fw-semibold">
                Fulfill Orders →
              </Link>
            </div>
          </div>
        </div>

        {/* Total Sales from Verified Successful Payments */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100 p-3 bg-white">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <span className="text-muted small fw-semibold text-uppercase">Verified Total Sales</span>
                <h3 className="fw-bold my-2 text-success">{formatCurrency(stats.totalSales)}</h3>
                <span className="badge bg-success-subtle text-success border border-success-subtle small">
                  From Verified "Paid" Orders
                </span>
              </div>
              <div className="p-3 rounded-circle bg-success-subtle text-success fs-5">
                <FaMoneyBillWave />
              </div>
            </div>
            <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center small text-muted">
              <span>Verified gateway revenue</span>
              <span className="fw-bold text-success">Live MongoDB</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Order Fulfillment Status Control Summary Cards */}
      <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
        <div className="card-header bg-transparent border-0 pt-3 px-3 pb-0 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold mb-0 text-dark">Order Delivery Status Breakdown</h5>
            <p className="text-muted small mb-0">Dynamic counts across every stage of the order lifecycle</p>
          </div>
          <Link to="/admin/orders" className="btn btn-outline-primary btn-sm">
            View All Orders <FaArrowRight className="ms-1" />
          </Link>
        </div>
        <div className="card-body p-3">
          <div className="row g-3">
            {/* Pending Orders */}
            <div className="col-6 col-md-4 col-xl-2">
              <div className="p-3 rounded-3 border text-center bg-light">
                <div className="text-warning fs-4 mb-1"><FaHourglassHalf /></div>
                <div className="fw-bold fs-4 text-dark">{stats.pendingOrders}</div>
                <div className="small text-muted fw-semibold">Pending Orders</div>
              </div>
            </div>

            {/* Processing Orders */}
            <div className="col-6 col-md-4 col-xl-2">
              <div className="p-3 rounded-3 border text-center bg-light">
                <div className="text-primary fs-4 mb-1"><FaCogs /></div>
                <div className="fw-bold fs-4 text-dark">{stats.processingOrders}</div>
                <div className="small text-muted fw-semibold">Processing</div>
              </div>
            </div>

            {/* Shipped Orders */}
            <div className="col-6 col-md-4 col-xl-2">
              <div className="p-3 rounded-3 border text-center bg-light">
                <div className="text-info fs-4 mb-1"><FaShippingFast /></div>
                <div className="fw-bold fs-4 text-dark">{stats.shippedOrders + stats.outForDeliveryOrders}</div>
                <div className="small text-muted fw-semibold">Shipped / In Transit</div>
              </div>
            </div>

            {/* Delivered Orders */}
            <div className="col-6 col-md-4 col-xl-2">
              <div className="p-3 rounded-3 border text-center bg-light">
                <div className="text-success fs-4 mb-1"><FaCheckCircle /></div>
                <div className="fw-bold fs-4 text-success">{stats.deliveredOrders}</div>
                <div className="small text-muted fw-semibold">Delivered Orders</div>
              </div>
            </div>

            {/* Cancelled Orders */}
            <div className="col-6 col-md-4 col-xl-2">
              <div className="p-3 rounded-3 border text-center bg-light">
                <div className="text-danger fs-4 mb-1"><FaTimesCircle /></div>
                <div className="fw-bold fs-4 text-danger">{stats.cancelledOrders}</div>
                <div className="small text-muted fw-semibold">Cancelled Orders</div>
              </div>
            </div>

            {/* Active Users */}
            <div className="col-6 col-md-4 col-xl-2">
              <div className="p-3 rounded-3 border text-center bg-light">
                <div className="text-secondary fs-4 mb-1"><FaUserCheck /></div>
                <div className="fw-bold fs-4 text-dark">{stats.activeUsers}</div>
                <div className="small text-muted fw-semibold">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Split Section: Recent Orders & Live User Activity Monitoring Stream */}
      <div className="row g-4 mb-4">
        {/* Left Column: Recent Orders */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
            <div className="card-header bg-transparent border-bottom py-3 px-3 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0 text-dark">Recent Customer Orders</h5>
                <small className="text-muted">Live orders placed by customers</small>
              </div>
              <Link to="/admin/orders" className="text-primary text-decoration-none small fw-semibold">
                Manage Orders →
              </Link>
            </div>
            <div className="card-body p-0">
              {stats.recentOrders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((ord) => (
                        <tr key={ord._id}>
                          <td className="ps-3 fw-semibold text-primary">
                            {ord.orderId || `ORD-${String(ord._id).slice(-6)}`}
                          </td>
                          <td>
                            <div className="fw-bold text-dark">
                              {ord.customerName || (typeof ord.shippingAddress === 'object' && (ord.shippingAddress?.fullName || ord.shippingAddress?.name)) || (ord.user?.role !== 'admin' ? ord.user?.name : '') || "Customer"}
                            </div>
                            <div className="text-muted small">
                              {ord.email || (typeof ord.shippingAddress === 'object' && ord.shippingAddress?.email) || (ord.user?.role !== 'admin' ? ord.user?.email : '') || ""}
                            </div>
                          </td>
                          <td className="fw-bold text-dark">{formatCurrency(ord.totalAmount)}</td>
                          <td>
                            <span className={`badge ${getPaymentStatusBadgeClass(ord.paymentStatus)}`}>
                              {ord.paymentStatus || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getOrderStatusBadgeClass(ord.orderStatus)}`}>
                              {ord.orderStatus || 'Confirmed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <p className="mb-0">No customer orders recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live User Activity Monitoring Feed */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
            <div className="card-header bg-transparent border-bottom py-3 px-3 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                  <FaHistory className="text-primary" /> User Activity Monitoring
                </h5>
                <small className="text-muted">Live server-generated audit logs</small>
              </div>
              <Link to="/admin/activity-logs" className="text-primary text-decoration-none small fw-semibold">
                Full Log Stream →
              </Link>
            </div>
            <div className="card-body p-3">
              {stats.recentActivities.length > 0 ? (
                <div className="activity-stream" style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {stats.recentActivities.map((act) => (
                    <div key={act._id} className="p-2 border-bottom d-flex align-items-start gap-2 mb-2">
                      <div className="mt-1">
                        <span className="badge bg-secondary-subtle text-dark border small">
                          {act.actionType}
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <div className="text-dark small fw-semibold">{act.description}</div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          By: <span className="fw-semibold">{act.userName || "System"}</span> •{" "}
                          {new Date(act.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <FaHistory className="fs-1 mb-2 text-secondary opacity-50" />
                  <p className="small mb-0">No activity logged yet. System will track logins, orders, and products automatically.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deshboard;
