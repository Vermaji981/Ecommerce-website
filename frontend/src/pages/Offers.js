import React, { useState, useEffect } from "react";
import { getCoupons, createCoupon, deleteCoupon } from "../services/adminService";
import ConfirmModal from "../component/ConfirmModal";
import AdminLoader from "../component/AdminLoader";
import DataTable from "../component/DataTable";
import { FaPercent, FaPlus, FaTrash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function Offers() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("0");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCouponsData();
  }, []);

  const fetchCouponsData = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data?.coupons || (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch coupon codes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!code || !discountValue) {
      setError("Coupon Code and Discount Value are required.");
      return;
    }

    try {
      await createCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount || 0),
        isActive: true
      });

      setSuccessMsg("Coupon code created successfully!");
      setCode("");
      setDiscountValue("");
      setMinOrderAmount("0");
      fetchCouponsData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create coupon.");
    }
  };

  const handleDeletePrompt = (coupon) => {
    setSelectedCoupon(coupon);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCoupon = async () => {
    if (!selectedCoupon) return;
    setDeleting(true);
    try {
      await deleteCoupon(selectedCoupon._id || selectedCoupon.id);
      setSuccessMsg(`Coupon "${selectedCoupon.code}" deleted.`);
      setDeleteModalOpen(false);
      setSelectedCoupon(null);
      fetchCouponsData();
    } catch (err) {
      console.error(err);
      setError("Failed to delete coupon code.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: "Coupon Code",
      accessor: "code",
      render: (item) => (
        <span className="badge bg-primary fs-6 px-3 py-2 fw-bold text-uppercase border border-white shadow-sm">
          {item.code}
        </span>
      )
    },
    {
      header: "Discount",
      accessor: "discountValue",
      render: (item) => (
        <span className="fw-bold text-success fs-6">
          {item.discountType === "percentage" ? `${item.discountValue}% OFF` : `₹${item.discountValue} FLAT OFF`}
        </span>
      )
    },
    {
      header: "Min Order",
      accessor: "minOrderAmount",
      render: (item) => <span className="fw-bold text-dark">₹{item.minOrderAmount || 0}</span>
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (item) => (
        <span className={`badge ${item.isActive !== false ? "bg-success" : "bg-secondary"} px-3 py-1.5 rounded-pill`}>
          {item.isActive !== false ? "Active" : "Expired"}
        </span>
      )
    }
  ];

  if (loading) return <AdminLoader message="Fetching active promotional coupons..." />;

  return (
    <div className="offers-page">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <FaPercent className="text-primary" /> Promotional Coupons & Offers
          </h2>
          <p className="text-muted small">Manage discount codes and customer cart coupons</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-3 mb-4 d-flex align-items-center">
          <FaExclamationTriangle className="me-2" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success rounded-3 mb-4 d-flex align-items-center">
          <FaCheckCircle className="me-2" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="row g-4">
        {/* Form Column */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">Create Coupon Code</h5>

            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Coupon Code *</label>
                <input
                  type="text"
                  className="form-control text-dark fw-bold text-uppercase"
                  required
                  placeholder="e.g. WELCOME50"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Discount Type</label>
                <select
                  className="form-select text-dark fw-bold"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Discount Value *</label>
                <input
                  type="number"
                  className="form-control text-dark fw-bold"
                  required
                  placeholder="e.g. 10 for 10% or 500 for ₹500"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold text-dark">Min Cart Order (₹)</label>
                <input
                  type="number"
                  className="form-control text-dark fw-bold"
                  placeholder="0 for no minimum"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100 rounded-pill fw-bold">
                <FaPlus className="me-1" /> Create Coupon
              </button>
            </form>
          </div>
        </div>

        {/* Data Table Column */}
        <div className="col-lg-8">
          <DataTable
            columns={columns}
            data={coupons}
            searchKey="code"
            placeholder="Search coupon codes..."
            actions={(item) => (
              <button
                className="btn btn-sm btn-outline-danger rounded-circle"
                title="Delete Coupon"
                onClick={() => handleDeletePrompt(item)}
              >
                <FaTrash />
              </button>
            )}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Coupon Code"
        message="Are you sure you want to delete this coupon code?"
        itemName={selectedCoupon?.code}
        onConfirm={confirmDeleteCoupon}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedCoupon(null);
        }}
        loading={deleting}
      />
    </div>
  );
}

export default Offers;
