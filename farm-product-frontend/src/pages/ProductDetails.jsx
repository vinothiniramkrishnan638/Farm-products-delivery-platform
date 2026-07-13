import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { getProductById } from "../api/productApi";
import countryChicken from "../assets/country_chicken.jpg";
import countryEggs from "../assets/country_eggs.jpg";
import freshWaterPrawn from "../assets/fresh_water_prawn.jpg";
import goatMilk from "../assets/goat_milk.jpg";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const outOfStock = product?.stock <= 0;

  const getProductImage = () => {
    if (product?.product_name) {
      const name = product.product_name.toLowerCase();
      if (name.includes("country chicken")) return countryChicken;
      if (name.includes("country eggs") || name.includes("county eggs")) return countryEggs;
      if (name.includes("fresh water prawn")) return freshWaterPrawn;
      if (name.includes("goat milk")) return goatMilk;
    }
    return product?.product_image;
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] flex flex-col">
      <Header />
      <Navbar />

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="text-green-700 hover:text-green-800 font-bold text-sm bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1 mb-5 active:scale-95 transition-all shadow-sm w-fit"
        >
          ← Back
        </button>

        {loading && <Loader text="Loading product details..." />}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {!loading && !error && product && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden md:flex gap-8 p-6">
            {/* Image side */}
            <div className="w-full md:w-1/2 h-80 md:h-[400px] bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
              {!imgError && getProductImage() ? (
                <img
                  src={getProductImage()}
                  alt={product.product_name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-contain bg-gray-50 p-2"
                />
              ) : (
                <span className="text-gray-400 text-sm font-medium">No Image Available</span>
              )}
            </div>

            {/* Details side */}
            <div className="w-full md:w-1/2 flex flex-col justify-between mt-6 md:mt-0">
              <div>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
                  Fresh Product
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight">
                  {product.product_name}
                </h1>
                <p className="text-sm text-gray-400 mt-1">Product ID: {product.id}</p>

                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-2xl md:text-3xl font-black text-green-700">
                    ₹{product.price}
                  </span>
                  <span className="text-gray-400 text-sm">/ {product.unit}</span>
                </div>

                <div className="mt-6 border-t border-b border-gray-100 py-4">
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {product.description || "No description provided for this product."}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-gray-500">Availability</span>
                  <span
                    className={`text-sm font-bold ${
                      outOfStock ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {outOfStock ? "Out of Stock" : `${product.stock} ${product.unit}(s) available`}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="w-full bg-green-600 text-white font-bold py-3.5 rounded-2xl shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50 active:scale-98"
                >
                  {added ? "Added to Cart ✓" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
