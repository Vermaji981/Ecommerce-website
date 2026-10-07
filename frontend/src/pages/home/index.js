import React, { useEffect, useState } from "react";
import HomeBanner from "../../component/HomeBanner/index";
import { Link } from "react-router-dom";
import { girl2, ladyimage, workerimage } from "../../slider";
import ProductCard from "../../component/ProductCard/index";
import IconsDelivery from "./IconsDelivery";
import { api } from "../../services/api";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Home product fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <>
      <HomeBanner />

      <section className="homeProduct">
        <div className="home-container">
          <div className="promo-banners-wrap mb-4">
            <div className="cursor">
              <Link to="/shop">
                <img src={workerimage} alt="worker promo" />
              </Link>
              <Link to="/shop">
                <img src={ladyimage} alt="lady promo" />
              </Link>
              <Link to="/shop">
                <img src={girl2} alt="girl promo" />
              </Link>
            </div>
          </div>

          <div className="onsaleproduct">
            <div className="title-box">
              <h2>On Sale Products</h2>
              <Link to="/shop" className="shop-btn">
                View All Products &rarr;
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading products...</span>
                </div>
              </div>
            ) : products.length > 0 ? (
              <div className="row g-4 mt-2">
                {products.map((p) => {
                  const catStr = typeof p.category === 'object' && p.category !== null 
                    ? (p.category.name || 'General') 
                    : (p.category || p.catogries || "General");
                  return (
                    <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={p._id || p.id}>
                      <ProductCard
                        id={p._id || p.id}
                        image={p.image}
                        img={p.img}
                        images={p.images}
                        title={p.title || p.name || "Product Title"}
                        price={p.price}
                        originalPrice={p.originalPrice || (p.price ? p.price * 1.2 : null)}
                        rating={p.rating || 4.8}
                        reviews={p.reviews || 150}
                        badge={p.badge || "Live"}
                        metadata={`${p.brand || "Brand"} · ${catStr}`}
                        link={`/product/${p._id || p.id}`}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-5">
                <p>No products available yet. Add products from the Admin Dashboard!</p>
                <Link to="/add-product" className="btn btn-primary btn-sm mt-2">
                  + Add Product in Dashboard
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <IconsDelivery />
    </>
  );
};

export default Home;
