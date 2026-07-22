import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import ProductImageGallery from "../components/ProductImageGallery";
import QuantitySelector from "../components/QuantitySelector";
import RelatedProducts from "../components/RelatedProducts";
import { getProductById, getRelatedProducts, getPopularProducts } from "../api/productApi";
import { useCart } from "../context/CartContext";
import countryChicken from "../assets/country_chicken.jpg";
import countryEggs from "../assets/country_eggs.jpg";
import freshWaterPrawn from "../assets/fresh_water_prawn.jpg";
import goatMilk from "../assets/goat_milk.jpg";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setQuantity(1);
        const [productRes, relatedRes, popularRes] = await Promise.all([
          getProductById(id),
          getRelatedProducts(id),
          getPopularProducts(),
        ]);
        setProduct(productRes.data);
        setRelatedProducts(relatedRes.data);
        setSimilarProducts(popularRes.data.filter((p) => p.id !== Number(id)));
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const getLocalImageOverride = () => {
    if (product?.product_name) {
      const name = product.product_name.toLowerCase();
      if (name.includes("country chicken")) return countryChicken;
      if (name.includes("country eggs") || name.includes("county eggs")) return countryEggs;
      if (name.includes("fresh water prawn")) return freshWaterPrawn;
      if (name.includes("goat milk")) return goatMilk;
    }
    return null;
  };

  const getImageList = () => {
    const override = getLocalImageOverride();
    if (override) return [override];
    if (product?.images && product.images.length > 0) return product.images;
    if (product?.product_image) return [product.product_image];
    return [];
  };

  const outOfStock = product?.stock <= 0;

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      navigate("/cart");
    } catch (err) {
      setError("Failed to process. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfa] flex flex-col page-fade-in">
      <Header />
      <Navbar />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
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
          <>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden md:flex gap-8 p-6">
              <div className="w-full md:w-1/2">
                <ProductImageGallery images={getImageList()} productName={product.product_name} />
              </div>

              <div className="w-full md:w-1/2 flex flex-col justify-between mt-6 md:mt-0">
                <div>
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider mb-3">
                    {product.category_name || "Fresh Product"}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight font-heading">
                    {product.product_name}
                  </h1>

                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-2xl md:text-3xl font-black text-green-700">
                      ₹{product.price}
                    </span>
                    <span className="text-gray-400 text-sm">/ {product.unit}</span>
                  </div>

                  <div className="mt-6 border-t border-b border-gray-100 py-4 space-y-3">
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                      {product.description || "No description provided for this product."}
                    </p>
                    <p className="text-xs text-green-700 font-semibold">
                      🌿 Freshness Guaranteed — sourced directly from local farms
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      🚚 Delivery Available in your area within 24 hours
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-500">Availability</span>
                    <span className={`text-sm font-bold ${outOfStock ? "text-red-500" : "text-green-600"}`}>
                      {outOfStock ? "Out of Stock" : `${product.stock} ${product.unit}(s) available`}
                    </span>
                  </div>

                  {!outOfStock && (
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-sm font-semibold text-gray-500">Quantity</span>
                      <QuantitySelector
                        quantity={quantity}
                        max={product.stock}
                        onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                        onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))}
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    {/* Button A: Icon-Only Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={outOfStock || addingToCart}
                      title="Add to Cart"
                      className="flex-1 h-12 bg-white border-2 border-green-600 text-green-700 rounded-2xl hover:bg-green-50 transition-colors disabled:opacity-50 active:scale-95 flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                    </button>
                    {/* Button B: Short Text-Only Button */}
                    <button
                      onClick={handleBuyNow}
                      disabled={outOfStock || addingToCart}
                      className="flex-1 h-12 shimmer-button text-white font-extrabold text-base rounded-2xl shadow-sm active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <RelatedProducts title="Related Products" products={relatedProducts} />
            <RelatedProducts title="Similar Products" products={similarProducts} />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;