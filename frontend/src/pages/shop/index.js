import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../component/ProductCard/index";
import { FaTimes, FaSearch } from "react-icons/fa";
import { api } from "../../services/api";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Shop product load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getCategoryString = (product) => {
    if (!product) return "general";
    if (typeof product.category === "object" && product.category !== null) {
      return String(product.category.name || product.category.slug || product.catogries || "general");
    }
    if (typeof product.category === "string" && product.category.trim()) {
      return product.category;
    }
    if (typeof product.catogries === "string" && product.catogries.trim()) {
      return product.catogries;
    }
    return "general";
  };

  // Filter products by category & search term
  const filteredProducts = products.filter((product) => {
    const pCategory = getCategoryString(product).toLowerCase();
    const targetCat = selectedCategory.toLowerCase();

    let matchCategory = selectedCategory === "all";
    if (!matchCategory) {
      if (targetCat === "mobile" || targetCat === "mobiles") {
        matchCategory = pCategory.includes("mobile") || pCategory.includes("phone");
      } else if (targetCat === "electronics" || targetCat === "computer") {
        matchCategory = pCategory.includes("electronic") || pCategory.includes("computer") || pCategory.includes("laptop");
      } else if (targetCat === "homekitchen") {
        matchCategory = pCategory.includes("kitchen") || pCategory.includes("home");
      } else {
        matchCategory = pCategory.includes(targetCat);
      }
    }

    const qStr = searchQuery ? searchQuery.trim().toLowerCase() : "";
    const words = qStr.split(/\s+/).filter(Boolean);
    const fullText = [
      product.title,
      product.name,
      pCategory,
      product.brand,
      product.description,
      product.badge,
      product.sku,
      Array.isArray(product.specifications) ? product.specifications.join(" ") : "",
      Array.isArray(product.colors) ? product.colors.join(" ") : "",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchSearch = !qStr || fullText.includes(qStr) || (words.length > 0 && words.every((w) => fullText.includes(w)));

    return matchCategory && matchSearch;
  });

  const handleClearSearch = () => {
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  return (
    <div className="shop-page">
      <section className="shop-banner">
        <div className="container">
          <h1>{searchQuery ? `Search Results` : `Our Shop`}</h1>
          <p>
            {searchQuery
              ? `Showing results matching "${searchQuery}"`
              : `Browse our live collection of products`}
          </p>
        </div>
      </section>

      <section className="shop-content">
        <div className="container">
          <div className="row w-100">
            {/* Sidebar Filters */}
            <div className="col-lg-3 col-md-4 mb-4">
              <div className="shop-filters">
                <h5>Filter by Category</h5>
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${selectedCategory === "all" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Products
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "mobile" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("mobile")}
                  >
                    Mobiles
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "electronics" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("electronics")}
                  >
                    Electronics
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "shoes" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("shoes")}
                  >
                    Shoes
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "sunglasses" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("sunglasses")}
                  >
                    Sunglasses
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "grocery" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("grocery")}
                  >
                    Grocery
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "watches" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("watches")}
                  >
                    Watches
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "fitness" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("fitness")}
                  >
                    Fitness
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "furniture" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("furniture")}
                  >
                    Furniture
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "homekitchen" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("homekitchen")}
                  >
                    Home & Kitchen
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "magazines" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("magazines")}
                  >
                    Magazines
                  </button>
                  <button
                    className={`filter-btn ${selectedCategory === "mobilecovers" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("mobilecovers")}
                  >
                    Mobile Covers
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9 col-md-8">
              <div className="shop-products">
                {/* Search Query Active Tag */}
                {searchQuery && (
                  <div className="search-active-bar">
                    <span>
                      <FaSearch className="icon" /> Search for "<strong>{searchQuery}</strong>"
                    </span>
                    <button className="clear-search-tag" onClick={handleClearSearch}>
                      Clear Search <FaTimes />
                    </button>
                  </div>
                )}

                <h3>
                  Products Found ({filteredProducts.length})
                </h3>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading products...</span>
                    </div>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="row g-4">
                    {filteredProducts.map((product) => (
                      <div className="col-lg-4 col-md-6 col-sm-12" key={product._id || product.id}>
                        <ProductCard
                          id={product._id || product.id}
                          image={product.image}
                          img={product.img}
                          images={product.images}
                          title={product.title || product.name || "Product Item"}
                          price={product.price}
                          originalPrice={product.originalPrice || (product.price ? product.price * 1.2 : null)}
                          rating={product.rating || 4.8}
                          reviews={product.reviews || 120}
                          badge={product.badge || "Live"}
                          link={`/product/${product._id || product.id}`}
                          metadata={`${product.brand || "Brand"} · ${getCategoryString(product)}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-search-results">
                    <h4>No items found in this category</h4>
                    <p>Try selecting a different category or resetting your search filter.</p>
                    {searchQuery && (
                      <button className="reset-btn" onClick={handleClearSearch}>
                        Reset Search & View All Products
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
