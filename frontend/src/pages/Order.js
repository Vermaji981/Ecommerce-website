import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../component/Loader";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      const raw = response.data?.orders || response.data?.data || response.data;
      setOrders(Array.isArray(raw) ? raw : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading orders list..." />;

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">Track customer orders and fulfillment status saved in MongoDB</p>
        </div>
        <div className="badge badge-neutral font-semibold">
          Total Orders: {orders.length}
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          {orders.length > 0 ? (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Purchased Items</th>
                  <th>Total Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord, idx) => (
                  <tr key={ord._id || ord.id || idx}>
                    <td><strong>{ord.orderId || `ORD-${String(ord._id || idx).slice(-6)}`}</strong></td>
                    <td>{ord.customerName || ord.customer || "Guest Customer"}</td>
                    <td>{ord.email || "—"}</td>
                    <td>{ord.title || (ord.items ? ord.items.map(i => i.title).join(", ") : "Product Item")}</td>
                    <td className="price-tag">₹{ord.totalAmount || ord.total || 0}</td>
                    <td><span className="badge badge-neutral">{ord.paymentMethod || "Card"}</span></td>
                    <td>
                      <span className={`badge ${ord.status === 'paid' || ord.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                        {ord.status || 'paid'}
                      </span>
                    </td>
                    <td>{ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : "Today"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No orders found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;
