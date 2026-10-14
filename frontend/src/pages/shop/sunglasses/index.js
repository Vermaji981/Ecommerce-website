import React, { useState, useEffect } from "react";
import ProductCard from "../../../component/ProductCard/index";
import { getProductsApi } from "../../../services/api";

const ShopSunglasses = () => {
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProductsApi({ category: "Sunglasses" });
        let raw = res.data?.products || res.data || [];
        if (!Array.isArray(raw) || raw.length === 0) {
          const allRes = await getProductsApi();
          raw = allRes.data?.products || allRes.data || [];
        }
        setProducts(raw.map((p) => ({
          ...p,
          id: p._id || p.id,
          title: p.name || p.title,
          image: p.image || p.img || (Array.isArray(p.images) && p.images[0]) || "/placeholder.jpg",
          brand: p.brand || "Brand"
        })));
      } catch (err) {
        console.error("Error fetching sunglasses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const brands = ["all", ...Array.from(new Set(products.map((item) => item.brand)))];

  const filteredProducts = selectedBrand === "all"
    ? products
    : products.filter((p) => p.brand === selectedBrand);

  return (
    <div className="shop-page">
      <section className="shop-banner">
        <div className="container">
          <h1>Sunglasses Collection</h1>
          <p>Explore luxury and designer sunglasses from world-class brands</p>
        </div>
      </section>

      <section className="shop-content">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3 mb-4">
              <div className="shop-filters">
                <h5>Filter by Brand</h5>
                <div className="filter-buttons">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      className={`filter-btn ${selectedBrand === brand ? "active" : ""}`}
                      onClick={() => setSelectedBrand(brand)}
                    >
                      {brand === "all" ? "All Brands" : brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-md-9">
              <div className="shop-products">
                <h3>Sunglasses ({filteredProducts.length})</h3>
                <div className="row g-4 mt-1">
                  {loading ? (
                    <div className="col-12 text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading sunglasses...</span>
                      </div>
                    </div>
                  ) : (
                    filteredProducts.map((product) => {
                      const pImage = product.image || (Array.isArray(product.images) && product.images[0]) || "/placeholder.jpg";
                      const pColor = (Array.isArray(product.colors) && product.colors[0]) || "Standard";
                      return (
                        <div className="col-md-4 col-sm-6" key={product.id}>
                          <ProductCard
                            id={product.id}
                            image={pImage}
                            title={product.title}
                            price={product.price}
                            originalPrice={product.originalPrice || product.price * 1.2}
                            rating={product.rating || 4.5}
                            reviews={product.reviews || 10}
                            badge={product.badge || "Popular"}
                            metadata={`${product.brand || "Brand"} · ${pColor}`}
                            link={`/product/${product.id}`}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopSunglasses;
