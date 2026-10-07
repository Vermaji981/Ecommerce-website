import React, { useState } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function DataTable({
  columns,
  data = [],
  searchKey = "name",
  placeholder = "Search records...",
  actions = null,
  pageSize = 8
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Data based on Search Term
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const value = item[searchKey] || item.title || item.name || item.email || "";
    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const currentData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
      {/* Search Header */}
      <div className="card-header bg-white border-0 py-3 px-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div className="position-relative flex-grow-1 max-w-md">
          <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-primary" />
          <input
            type="text"
            className="form-control ps-5 rounded-pill border-light-subtle bg-light text-dark fw-bold"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="text-muted small fw-bold">
          Showing {filteredData.length} entries
        </div>
      </div>

      {/* Table Body */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="text-dark fw-bold text-uppercase py-3 fs-7" style={{ letterSpacing: "0.5px" }}>
                  {col.header}
                </th>
              ))}
              {actions && <th className="text-end text-dark fw-bold text-uppercase py-3 fs-7 me-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, rowIdx) => (
                <tr key={item._id || item.id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="py-3 text-dark fw-semibold">
                      {col.render ? col.render(item) : item[col.accessor]}
                    </td>
                  ))}
                  {actions && <td className="text-end py-3">{actions(item)}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-5 text-muted">
                  <div className="py-3">
                    <p className="fw-bold mb-1">No matching records found</p>
                    <small>Try adjusting your search criteria</small>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="card-footer bg-white border-0 py-3 px-4 d-flex align-items-center justify-content-between">
          <span className="small text-muted fw-bold">
            Page {currentPage} of {totalPages}
          </span>
          <div className="d-flex align-items-center gap-1">
            <button
              className="btn btn-sm btn-outline-secondary rounded-circle"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
            <button
              className="btn btn-sm btn-outline-secondary rounded-circle"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
