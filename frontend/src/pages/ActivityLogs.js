import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Loader from "../component/Loader";
import {
  FaHistory,
  FaSearch,
  FaFilter,
  FaShoppingBag,
  FaBoxOpen,
  FaSyncAlt
} from "react-icons/fa";

function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [actionType, setActionType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getActivityLogs({
        page,
        limit: 15,
        search: searchTerm || undefined,
        actionType: actionType !== "all" ? actionType : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined
      });

      const data = res.data;
      setLogs(Array.isArray(data.logs) ? data.logs : []);
      setTotalLogs(data.total || (data.logs ? data.logs.length : 0));
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error("Error fetching activity logs:", err);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, actionType, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const handleReset = () => {
    setSearchTerm("");
    setActionType("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const getActionBadge = (type) => {
    switch (type) {
      case "USER_REGISTER":
      case "USER_LOGIN":
        return <span className="badge bg-primary-subtle text-primary border border-primary-subtle">{type}</span>;
      case "ORDER_PLACE":
        return <span className="badge bg-warning-subtle text-dark border border-warning-subtle">{type}</span>;
      case "PAYMENT_SUCCESS":
        return <span className="badge bg-success-subtle text-success border border-success-subtle">{type}</span>;
      case "PAYMENT_FAILED":
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">{type}</span>;
      case "ORDER_STATUS_CHANGE":
        return <span className="badge bg-info-subtle text-info border border-info-subtle">{type}</span>;
      case "ORDER_CANCEL":
        return <span className="badge bg-danger-subtle text-danger border border-danger-subtle">{type}</span>;
      case "PRODUCT_CREATE":
      case "PRODUCT_UPDATE":
        return <span className="badge bg-secondary-subtle text-dark border border-secondary-subtle">{type}</span>;
      case "PRODUCT_DELETE":
        return <span className="badge bg-danger text-white">{type}</span>;
      case "USER_STATUS_CHANGE":
        return <span className="badge bg-dark text-white">{type}</span>;
      default:
        return <span className="badge bg-light text-dark border">{type}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  return (
    <div className="activity-logs-page p-3 p-md-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="h3 fw-bold mb-1 text-dark d-flex align-items-center gap-2">
            <FaHistory className="text-primary" /> User Activity Monitoring & Audit Logs
          </h1>
          <p className="text-muted small mb-0">
            Immutable server-generated audit records for user authentication, orders, payments & catalog actions
          </p>
        </div>
        <div className="badge bg-primary fs-6 py-2 px-3">
          Total Logs: {totalLogs}
        </div>
      </div>

      {/* Filter Card */}
      <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
        <div className="card-body p-3">
          <form onSubmit={handleFilterSubmit} className="row g-2 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-muted mb-1">Search Keywords</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search user, ID, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold text-muted mb-1">Action Type</label>
              <select
                className="form-select form-select-sm"
                value={actionType}
                onChange={(e) => {
                  setActionType(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All Action Types</option>
                <option value="USER_REGISTER">User Registration</option>
                <option value="USER_LOGIN">User Login</option>
                <option value="ORDER_PLACE">Order Placed</option>
                <option value="PAYMENT_SUCCESS">Payment Success</option>
                <option value="PAYMENT_FAILED">Payment Failed</option>
                <option value="ORDER_STATUS_CHANGE">Order Status Changed</option>
                <option value="ORDER_CANCEL">Order Cancelled</option>
                <option value="PRODUCT_CREATE">Product Created</option>
                <option value="PRODUCT_UPDATE">Product Updated</option>
                <option value="PRODUCT_DELETE">Product Deleted</option>
                <option value="USER_STATUS_CHANGE">User Account Status Changed</option>
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

            <div className="col-6 col-md-1 d-flex gap-1">
              <button type="submit" className="btn btn-primary btn-sm w-100" title="Apply Filters">
                <FaFilter />
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleReset}
                title="Reset Filters"
              >
                <FaSyncAlt />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card border-0 shadow-sm rounded-3 bg-white">
        <div className="card-body p-0">
          {loading ? (
            <div className="py-5">
              <Loader text="Retrieving server activity logs from MongoDB..." />
            </div>
          ) : logs.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-3">Activity ID</th>
                    <th>Date & Time</th>
                    <th>User / Account</th>
                    <th>Action Type</th>
                    <th>Entity Reference</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id}>
                      <td className="ps-3">
                        <code className="text-secondary small fw-bold">{log.activityId || String(log._id).slice(-8)}</code>
                      </td>
                      <td className="small text-muted" style={{ whiteSpace: "nowrap" }}>
                        {formatDate(log.createdAt)}
                      </td>
                      <td>
                        <div className="fw-bold text-dark small">{log.userName || "System"}</div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                          {log.userEmail || (log.user ? `ID: ${String(log.user).slice(-6)}` : "Guest")}
                        </div>
                      </td>
                      <td>{getActionBadge(log.actionType)}</td>
                      <td>
                        {log.orderId ? (
                          <span className="badge bg-light text-dark border small d-inline-flex align-items-center gap-1">
                            <FaShoppingBag className="text-warning" /> {log.orderId}
                          </span>
                        ) : log.productId ? (
                          <span className="badge bg-light text-dark border small d-inline-flex align-items-center gap-1">
                            <FaBoxOpen className="text-info" /> Prod: {String(log.productId).slice(-6)}
                          </span>
                        ) : log.entityId ? (
                          <span className="badge bg-light text-dark border small">
                            {log.entityType}: {String(log.entityId).slice(-6)}
                          </span>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td>
                        <div className="small text-dark fw-semibold">{log.description}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 text-muted">
              <FaHistory className="fs-1 mb-2 text-secondary opacity-50" />
              <p className="mb-0">No activity records match your filter criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-top py-3 d-flex justify-content-between align-items-center">
            <span className="small text-muted">
              Page {page} of {totalPages} ({totalLogs} audit records)
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
    </div>
  );
}

export default ActivityLogs;
