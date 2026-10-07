import React from "react";
import { FaExclamationTriangle, FaTrash, FaTimes } from "react-icons/fa";

function ConfirmModal({ isOpen, title, message, itemName, onConfirm, onCancel, loading = false }) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        zIndex: 105000,
        backdropFilter: "blur(4px)"
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "460px", width: "90%", backgroundColor: "#ffffff" }}
      >
        <div className="card-header bg-danger text-white border-0 py-3 px-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <FaExclamationTriangle className="fs-5" />
            <h5 className="mb-0 fw-bold fs-6">{title || "Confirm Deletion"}</h5>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white shadow-none"
            onClick={onCancel}
            disabled={loading}
          ></button>
        </div>

        <div className="card-body p-4 text-center">
          <div className="mb-3">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger p-3 mb-2"
              style={{ width: "64px", height: "64px" }}
            >
              <FaTrash className="fs-3" />
            </div>
          </div>

          <h6 className="fw-bold text-dark mb-2">
            {message || "Are you sure you want to permanently delete this item?"}
          </h6>

          {itemName && (
            <p className="bg-light p-2 rounded-3 fw-bold text-danger fs-7 text-truncate mb-3 border border-danger-subtle">
              "{itemName}"
            </p>
          )}

          <p className="text-muted small mb-0">
            This action cannot be undone. Business metrics and order dependencies will be preserved.
          </p>
        </div>

        <div className="card-footer bg-light border-0 py-3 px-4 d-flex align-items-center justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-4 fw-bold"
            onClick={onCancel}
            disabled={loading}
          >
            <FaTimes className="me-1" /> Cancel
          </button>

          <button
            type="button"
            className="btn btn-danger rounded-pill px-4 fw-bold d-flex align-items-center"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span>Deleting...</span>
            ) : (
              <>
                <FaTrash className="me-1" /> Confirm Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
