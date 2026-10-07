import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import { api } from "../../../services/api";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        try {
          const data = await api.getProducts({ search: query.trim() });
          setResults(Array.isArray(data) ? data : []);
          setIsOpen(true);
        } catch (err) {
          console.error("Search API error:", err);
          setResults([]);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (product) => {
    setIsOpen(false);
    setQuery("");
    if (product.link) {
      navigate(product.link);
    } else {
      navigate(`/shop?search=${encodeURIComponent(product.title)}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const formatPrice = (price) => {
    if (typeof price === "number" && price > 500) {
      return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
    }
    return `$${price}`;
  };

  return (
    <div className="searchbox-wrapper" ref={searchRef}>
      <form className="searchbar" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, brands and more..."
          aria-label="Search items"
        />

        {query && (
          <button
            type="button"
            className="clear-icon"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}

        <button type="submit" className="search-icon" aria-label="Search button">
          <FaSearch />
        </button>
      </form>

      {/* Live Dropdown Results Preview */}
      {isOpen && (
        <div className="search-dropdown-results">
          {results.length > 0 ? (
            <div className="dropdown-list">
              <div className="dropdown-header">
                Found {results.length} matching {results.length === 1 ? "item" : "items"}
              </div>
              {results.slice(0, 6).map((item) => {
                const itemId = item._id || item.id;
                const itemTitle = item.name || item.title;
                const itemImg = item.image || item.img || (Array.isArray(item.images) && item.images[0]) || "/placeholder.jpg";
                const catName = typeof item.category === "object" ? item.category?.name : (item.category || "General");
                return (
                  <div
                    key={itemId}
                    className="dropdown-item"
                    onClick={() => handleSelectProduct(item)}
                  >
                    <img src={itemImg} alt={itemTitle} className="item-thumb" />
                    <div className="item-details">
                      <span className="item-title">{itemTitle}</span>
                      <span className="item-meta">
                        {item.brand || "Brand"} &bull; <span className="item-cat">{catName}</span>
                      </span>
                    </div>
                    <span className="item-price">{formatPrice(item.price)}</span>
                  </div>
                );
              })}

              <div
                className="dropdown-view-all"
                onClick={handleSearchSubmit}
              >
                View all results for "{query}" &rarr;
              </div>
            </div>
          ) : (
            <div className="dropdown-no-results">
              No products found matching "<strong>{query}</strong>"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;