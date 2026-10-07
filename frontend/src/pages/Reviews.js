import React, { useState, useEffect } from "react";
import { getReviews, deleteReview } from "../services/adminService";
import ConfirmModal from "../component/ConfirmModal";
import AdminLoader from "../component/AdminLoader";
import DataTable from "../component/DataTable";
import { FaStar, FaTrash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReviewsData();
  }, []);

  const fetchReviewsData = async () => {
    setLoading(true);
    try {
      const data = await getReviews();
      setReviews(data?.reviews || (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch customer reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrompt = (review) => {
    setSelectedReview(review);
    setDeleteModalOpen(true);
  };

  const confirmDeleteReview = async () => {
    if (!selectedReview) return;
    setDeleting(true);
    try {
      await deleteReview(selectedReview._id || selectedReview.id);
      setSuccessMsg("Review deleted successfully.");
      setDeleteModalOpen(false);
      setSelectedReview(null);
      fetchReviewsData();
    } catch (err) {
      console.error(err);
      setError("Failed to delete review.");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: "Customer & Product",
      accessor: "name",
      render: (item) => (
        <div>
          <h6 className="fw-bold text-dark mb-0">{item.user?.name || item.name || "Customer"}</h6>
          <small className="text-muted">{item.product?.name || item.productTitle || "Product Item"}</small>
        </div>
      )
    },
    {
      header: "Rating",
      accessor: "rating",
      render: (item) => (
        <div className="d-flex align-items-center text-warning fw-bold">
          <FaStar className="me-1" /> {item.rating || 5} / 5
        </div>
      )
    },
    {
      header: "Comment",
      accessor: "comment",
      render: (item) => <span className="text-dark fw-semibold">{item.comment}</span>
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (item) => (
        <span className="text-muted small fw-semibold">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Recent"}
        </span>
      )
    }
  ];

  if (loading) return <AdminLoader message="Fetching product reviews & ratings..." />;

  return (
    <div className="reviews-page">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <FaStar className="text-primary" /> Customer Ratings & Reviews
          </h2>
          <p className="text-muted small">Moderate feedback and delete inappropriate store reviews</p>
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

      <DataTable
        columns={columns}
        data={reviews}
        searchKey="comment"
        placeholder="Search reviews..."
        actions={(item) => (
          <button
            className="btn btn-sm btn-outline-danger rounded-circle"
            title="Delete Review"
            onClick={() => handleDeletePrompt(item)}
          >
            <FaTrash />
          </button>
        )}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Review"
        message="Are you sure you want to delete this customer review?"
        itemName={selectedReview ? `Review by ${selectedReview.name || "User"}` : ""}
        onConfirm={confirmDeleteReview}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedReview(null);
        }}
        loading={deleting}
      />
    </div>
  );
}

export default Reviews;
