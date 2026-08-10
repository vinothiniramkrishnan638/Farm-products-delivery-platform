import { useState, useEffect } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import HeroBanner from "../components/HeroBanner";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import {
  getCategories,
  getFeaturedProducts,
  getPopularProducts,
  searchProducts,
} from "../api/productApi";

const CustomerDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        setError("");
        const [categoriesRes, featuredRes, popularRes] = await Promise.all([
          getCategories(),
          getFeaturedProducts(),
          getPopularProducts(),
        ]);
        setCategories(categoriesRes.data);
        setFeaturedProducts(featuredRes.data);
        setPopularProducts(popularRes.data);
      } catch (err) {
        setError("Failed to load home page data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setError("");
      const res = await searchProducts(query);
      setSearchResults(res.data);
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] page-fade-in">
      <Header />
      <Navbar />
      <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

      {loading && <Loader text="Loading products..." />}

      {error && (
        <div className="mx-4 my-3 bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-3 py-2.5">
          {error}
        </div>
      )}

      {!loading && !error && searchResults !== null && (
        <div className="px-4 py-5">
          <p className="font-bold text-gray-800 mb-3">Search Results ({searchResults.length})</p>
          {searchResults.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && !error && searchResults === null && (
        <>
          <HeroBanner />

          <div id="categories" className="px-4 py-5 scroll-mt-[110px]">
            <p className="font-bold text-gray-800 mb-3">Shop by Category</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          <div id="featured" className="px-4 py-5 scroll-mt-[110px]">
            <p className="font-bold text-gray-800 mb-3">Featured Products</p>
            {featuredProducts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No featured products yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          <div id="popular" className="px-4 py-5 scroll-mt-[110px]">
            <p className="font-bold text-gray-800 mb-3">Popular Products</p>
            {popularProducts.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No popular products yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {popularProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default CustomerDashboard;