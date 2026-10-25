import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Loader from "../component/Loader";
import {
  FaShoppingBag,
  FaSearch,
  FaEye,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaHistory
} from "react-icons/fa";

function Order() {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrderStatus, setNewOrderStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAdminOrders({
        page,
        limit: 10,
        search: searchTerm || undefined,
        orderStatus: orderStatusFilter !== "all" ? orderStatusFilter : undefined,
        paymentStatus: paymentStatusFilter !== "all" ? paymentStatusFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });

      const data = res.data;
      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setTotalOrders(data.total || (data.orders ? data.orders.length : 0));
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error("Error fetching admin orders:", err);
      showMessage(err.response?.data?.message || "Failed to load orders list", "danger");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, orderStatusFilter, paymentStatusFilter, startDate, endDate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setOrderStatusFilter("all");
    setPaymentStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const openOrderDetails = async (order) => {
    setSelectedOrder(order);
    setNewOrderStatus(order.orderStatus || "Pending");
    setNewPaymentStatus(order.paymentStatus || "Pending");
    setStatusNote("");

    try {
      const res = await api.getAdminOrderById(order._id);
      if (res.data?.order) {
        setSelectedOrder(res.data.order);
        setNewOrderStatus(res.data.order.orderStatus || "Pending");
        setNewPaymentStatus(res.data.order.paymentStatus || "Pending");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setStatusNote("");
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdatingStatus(true);
      const res = await api.updateAdminOrderStatus(selectedOrder._id, {
        orderStatus: newOrderStatus,
        paymentStatus: newPaymentStatus,
        note: statusNote || undefined
      });

      const updated = res.data.order;
      showMessage(`Order #${updated.orderId || updated._id} status updated to "${updated.orderStatus}"!`);

      // Update in local state
      setOrders(orders.map((o) => (o._id === updated._id ? { ...o, ...updated } : o)));
      setSelectedOrder(updated);
      setStatusNote("");
    } catch (err) {
      showMessage(err.response?.data?.message || "Failed to update order status", "danger");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return <span className="badge bg-success-subtle text-success border border-success-subtle">● Delivered</span>;
      case "Shipped":
      case "Out for Delivery":
        return <span className="badge bg-info-subtle text-info border border-info-subtle">● {status}</span>;
      case "Processing":
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle">● Processing</span>;
      case "Confirmed":
        return <span className="badge bg-secondary-subtle text-dark border border-secondary-subtle">● Confirmed</span>;
      case "Cancelled":
      case "Returned":
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">✕ {status}</span>;
      case "Pending":
      default:
        return <span className="badge bg-warning-subtle text-dark border border-warning-subtle">⏳ Pending</span>;
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case "Paid":
        return <span className="badge bg-success text-white">Paid</span>;
      case "Failed":
        return <span className="badge bg-danger text-white">Failed</span>;
      case "Refunded":
        return <span className="badge bg-info text-dark">Refunded</span>;
      case "Pending":
      default:
        return <span className="badge bg-warning text-dark">Pending</span>;
    }
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

  const getCustomerDisplayName = (ord) => {
    if (!ord) return "Customer";
    const name = ord.customerName || (typeof ord.shippingAddress === 'object' && (ord.shippingAddress?.fullName || ord.shippingAddress?.name));
    if (name && name !== "Amazon Customer" && name !== "Customer") return name;
    if (ord.user && ord.user.role !== 'admin' && ord.user.name) return ord.user.name;
    return name || "Customer";
  };

  const getCustomerEmail = (ord) => {
    if (!ord) return "—";
    const email = ord.email || (typeof ord.shippingAddress === 'object' && ord.shippingAddress?.email);
    if (email && email !== "customer@amazon.com") return email;
    if (ord.user && ord.user.role !== 'admin' && ord.user.email) return ord.user.email;
    return email || "—";
  };

  const getCustomerPhone = (ord) => {
    if (!ord) return "Not provided";
    const phone = ord.phone || (typeof ord.shippingAddress === 'object' && ord.shippingAddress?.phone);
    if (phone) return phone;
    if (ord.user && ord.user.role !== 'admin' && ord.user.phone) return ord.user.phone;
    return "Not provided";
  };

  const renderShippingAddress = (ord) => {
    if (!ord || !ord.shippingAddress) {
      return <span className="text-muted fst-italic">Shipping details not available</span>;
    }

    if (typeof ord.shippingAddress === 'string') {
      const cleanAddr = ord.shippingAddress.replace(/^,\s*|,\s*$/g, '').trim();
      if (!cleanAddr) {
        return <span className="text-muted fst-italic">Shipping details not available</span>;
      }
      return <span>{cleanAddr}</span>;
    }

    const sa = ord.shippingAddress;
    const recipient = sa.fullName || sa.name || ord.customerName;
    const phone = sa.phone || ord.phone;
    const street = sa.street || sa.address;
    const city = sa.city;
    const state = sa.state;
    const postalCode = sa.postalCode || sa.pincode;
    const country = sa.country || 'India';

    if (!street && !city && !state && !postalCode) {
      return <span className="text-muted fst-italic">Shipping details not available</span>;
    }

    return (
      <div className="shipping-address-block">
        {recipient && (
          <div className="fw-bold text-dark mb-1">
            {recipient} {phone ? <span className="text-muted fw-normal">({phone})</span> : null}
          </div>
        )}
        {street && <div className="text-dark">{street}</div>}
        {(city || state || postalCode) && (
          <div className="text-dark">
            {[city, state].filter(Boolean).join(', ')} {postalCode ? `- ${postalCode}` : ''}
          </div>
        )}
        {country && <div className="text-muted small">{country}</div>}
      </div>
    );
  };

  return (
    <div className="orders-page p-3 p-md-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <FaShoppingBag className="text-primary" /> Order Management & Fulfillment Control
          </h1>
          <p className="text-muted small mb-0">
            Control delivery statuses, manage payments separately, view customer addresses, and monitor status history
          </p>
        </div>
        <div className="badge bg-primary fs-6 py-2 px-3">
          Total Orders: {totalOrders}
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
          <form onSubmit={handleFilterSubmit} className="row g-2 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">Search Orders</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Order ID, Customer, or Product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold text-muted mb-1">Order Status</label>
              <select
                className="form-select form-select-sm"
                value={orderStatusFilter}
                onChange={(e) => {
                  setOrderStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Order Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Returned">Returned</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold text-muted mb-1">Payment Status</label>
              <select
                className="form-select form-select-sm"
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Payment Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold text-muted mb-1">Start Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold text-muted mb-1">End Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-1 d-flex gap-1">
              <button type="submit" className="btn btn-primary btn-sm w-100" title="Filter Orders">
                Filter
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleResetFilters}
                title="Reset Filters"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5">
              <Loader text="Retrieving orders from MongoDB..." />
            </div>
          ) : orders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">Order ID</th>
                    <th>Customer</th>
                    <th>Product / Items</th>
                    <th>Qty</th>
                    <th>Total Amount</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Order Date</th>
                    <th className="text-end pe-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => {
                    const itemsArray = Array.isArray(ord.items) ? ord.items : [];
                    const itemsTitle =
                      itemsArray.length > 0
                        ? itemsArray.map((i) => i.name || i.title).join(", ")
                        : ord.title || "Store Item";
                    const totalQty = itemsArray.reduce((acc, i) => acc + (Number(i.quantity) || 1), 0);

                    return (
                      <tr key={ord._id}>
                        <td className="ps-3">
                          <code className="text-primary fw-bold small">
                            {ord.orderId || `ORD-${String(ord._id).slice(-6)}`}
                          </code>
                        </td>
                        <td>
                          <div className="fw-bold text-dark small">
                            {getCustomerDisplayName(ord)}
                          </div>
                          <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                            {getCustomerEmail(ord)}
                          </div>
                        </td>
                        <td>
                          <div
                            className="text-dark small text-truncate"
                            style={{ maxWidth: "220px" }}
                            title={itemsTitle}
                          >
                            {itemsTitle}
                          </div>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-light text-dark border">
                            {totalQty || 1}
                          </span>
                        </td>
                        <td>
                          <div className="fw-bold text-dark">₹{ord.totalAmount || 0}</div>
                          <small className="text-muted">{ord.paymentMethod || "CARD"}</small>
                        </td>
                        <td>{getPaymentBadge(ord.paymentStatus)}</td>
                        <td>{getOrderStatusBadge(ord.orderStatus)}</td>
                        <td className="small text-muted" style={{ whiteSpace: "nowrap" }}>
                          {formatDate(ord.createdAt)}
                        </td>
                        <td className="text-end pe-3">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 ms-auto"
                            onClick={() => openOrderDetails(ord)}
                          >
                            <FaEye /> Inspect & Fulfill
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <FaShoppingBag className="fs-1 mb-2 text-secondary opacity-50" />
              <p className="mb-0">No customer orders found matching your search.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center">
            <span className="small text-muted">
              Page {page} of {totalPages} ({totalOrders} orders)
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

      {/* Detailed Order Inspection & Fulfillment Modal */}
      {selectedOrder && (
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
                    <FaShoppingBag />
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold mb-0">
                      Order Fulfillment & Status Control: {selectedOrder.orderId || selectedOrder._id}
                    </h5>
                    <small className="text-muted">Placed on {formatDate(selectedOrder.createdAt)}</small>
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={closeOrderDetails}></button>
              </div>

              <div className="modal-body p-4">
                {/* 1. Admin Status Transition Control Panel */}
                <div className="card border-primary mb-4 bg-light shadow-sm">
                  <div className="card-header bg-primary text-white py-2 px-3 fw-bold small d-flex justify-content-between align-items-center">
                    <span>⚡ ADMIN ORDER & DELIVERY STATUS CONTROL</span>
                    <span className="badge bg-white text-primary">Authorized Admin Only</span>
                  </div>
                  <div className="card-body p-3">
                    <form onSubmit={handleStatusUpdate}>
                      <div className="row g-3">
                        {/* Order & Delivery Status */}
                        <div className="col-12 col-md-6">
                          <label className="form-label small fw-bold text-dark">
                            Order / Delivery Status:
                          </label>
                          <select
                            className="form-select"
                            value={newOrderStatus}
                            onChange={(e) => setNewOrderStatus(e.target.value)}
                          >
                            <option value="Pending">Pending (Awaiting Confirmation)</option>
                            <option value="Confirmed">Confirmed (Order Accepted)</option>
                            <option value="Processing">Processing (Packaging in Warehouse)</option>
                            <option value="Shipped">Shipped (Dispatched with Courier)</option>
                            <option value="Out for Delivery">Out for Delivery (Reaching Customer)</option>
                            <option value="Delivered">Delivered (Successfully Handed Over)</option>
                            <option value="Cancelled">Cancelled (Order Voided)</option>
                            <option value="Returned">Returned (Item Returned by Customer)</option>
                          </select>
                          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Current: <strong>{selectedOrder.orderStatus}</strong>
                          </small>
                        </div>

                        {/* Separate Payment Status */}
                        <div className="col-12 col-md-6">
                          <label className="form-label small fw-bold text-dark">
                            Payment Gateway Status:
                          </label>
                          <select
                            className="form-select"
                            value={newPaymentStatus}
                            onChange={(e) => setNewPaymentStatus(e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid (Verified Payment)</option>
                            <option value="Failed">Failed (Gateway Declined)</option>
                            <option value="Refunded">Refunded (Amount Reimbursed)</option>
                          </select>
                          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                            Current: <strong>{selectedOrder.paymentStatus}</strong> (Separated from delivery)
                          </small>
                        </div>

                        {/* Status Note / Reason */}
                        <div className="col-12">
                          <label className="form-label small fw-bold text-dark">
                            Status Update Note / Tracking Reason:
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Courier tracking ID assigned / Package dispatched via BlueDart / Cancelled per customer request"
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-top d-flex justify-content-end gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm px-4 fw-semibold"
                          disabled={updatingStatus}
                        >
                          {updatingStatus ? "Saving to MongoDB..." : "Apply & Save Status Transition"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* 2. Customer & Delivery Address Card */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="card h-100 border rounded-3 p-3 bg-light">
                      <div className="fw-bold small text-muted text-uppercase mb-2 d-flex align-items-center gap-1">
                        <FaUser /> Customer Contact Details
                      </div>
                      <div className="fw-bold text-dark fs-6 mb-1">
                        {getCustomerDisplayName(selectedOrder)}
                      </div>
                      <div className="small text-muted mb-1">
                        <strong>Email:</strong> {getCustomerEmail(selectedOrder)}
                      </div>
                      <div className="small text-muted">
                        <strong>Phone:</strong> {getCustomerPhone(selectedOrder)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card h-100 border rounded-3 p-3 bg-light">
                      <div className="fw-bold small text-muted text-uppercase mb-2 d-flex align-items-center gap-1">
                        <FaMapMarkerAlt /> Delivery Shipping Address
                      </div>
                      <div className="small text-dark">
                        {renderShippingAddress(selectedOrder)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Purchased Items List */}
                <div className="card border rounded-3 mb-4">
                  <div className="card-header bg-light py-2 px-3 fw-bold small">
                    Order Items ({Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0})
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-sm table-hover mb-0">
                        <thead className="table-light">
                          <tr>
                            <th className="ps-3">Item</th>
                            <th className="text-center">Price</th>
                            <th className="text-center">Qty</th>
                            <th className="text-end pe-3">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                            selectedOrder.items.map((item, idx) => (
                              <tr key={idx}>
                                <td className="ps-3">
                                  <div className="d-flex align-items-center gap-2">
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt={item.name || item.title}
                                        className="rounded border"
                                        style={{ width: "36px", height: "36px", objectFit: "cover" }}
                                      />
                                    )}
                                    <div className="fw-semibold small">{item.name || item.title || "Product"}</div>
                                  </div>
                                </td>
                                <td className="text-center small">₹{item.price || 0}</td>
                                <td className="text-center small">{item.quantity || 1}</td>
                                <td className="text-end pe-3 fw-bold small">
                                  ₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center py-3 text-muted">
                                {selectedOrder.title || "Product item"} - ₹{selectedOrder.totalAmount}
                              </td>
                            </tr>
                          )}
                        </tbody>
                        <tfoot className="table-light">
                          <tr>
                            <td colSpan="3" className="text-end fw-bold">Total Order Amount:</td>
                            <td className="text-end pe-3 fw-bold text-success fs-6">
                              ₹{selectedOrder.totalAmount || 0}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                {/* 4. Complete Status Transition Audit Trail (Status History) */}
                <div>
                  <h6 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
                    <FaHistory className="text-primary" /> Delivery Status History Audit Trail
                  </h6>
                  {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 ? (
                    <div className="border rounded-3 p-3 bg-light">
                      <div className="timeline">
                        {selectedOrder.statusHistory.map((sh, idx) => (
                          <div key={idx} className="d-flex align-items-start gap-3 mb-3 border-bottom pb-2">
                            <div className="p-2 bg-primary text-white rounded-circle small mt-1">
                              <FaClock />
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <span className="badge bg-primary me-2">{sh.status}</span>
                                  {sh.previousStatus && (
                                    <small className="text-muted">
                                      (Transitioned from: <strong>{sh.previousStatus}</strong>)
                                    </small>
                                  )}
                                </div>
                                <span className="small text-muted">{formatDate(sh.changedAt)}</span>
                              </div>
                              <div className="small text-dark mt-1">
                                Changed by: <strong>{sh.changedByName || "Staff"}</strong>
                              </div>
                              {sh.note && (
                                <div className="small text-muted fst-italic mt-1 bg-white p-2 rounded border">
                                  Note: "{sh.note}"
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted small fst-italic">No prior status transitions recorded.</p>
                  )}
                </div>
              </div>

              <div className="modal-footer bg-light border-top">
                <button type="button" className="btn btn-secondary btn-sm" onClick={closeOrderDetails}>
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

export default Order;
