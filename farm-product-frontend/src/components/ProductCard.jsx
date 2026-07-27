import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import countryChicken from "../assets/country_chicken.jpg";
import countryEggs from "../assets/country_eggs.jpg";
import freshWaterPrawn from "../assets/fresh_water_prawn.jpg";
import goatMilk from "../assets/goat_milk.jpg";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setImgError(false);
  }, [product]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart(product.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      setAdded(false);
    } finally {
      setAdding(false);
    }
  };

  const outOfStock = product.stock <= 0;

  const getProductImage = () => {
    if (product.product_name) {
      const name = product.product_name.toLowerCase();
      if (name.includes("country chicken")) return countryChicken;
      if (name.includes("country eggs") || name.includes("county eggs")) return countryEggs;
      if (name.includes("fresh water prawn")) return freshWaterPrawn;
      if (name.includes("goat milk")) return goatMilk;
    }
    return product.product_image;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100/70 overflow-hidden flex flex-col hover:shadow-lg hover:shadow-green-100/30 hover:-translate-y-1.5 transition-all duration-300 shadow-sm">
      <Link
        to={`/product/${product.id}`}
        className="w-full h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden block cursor-pointer group"
      >
        {!imgError && getProductImage() ? (
          <img
            src={getProductImage()}
            alt={product.product_name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain bg-gray-50 p-2 transition-transform duration-550 group-hover:scale-105"
          />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm font-semibold text-gray-800 leading-tight">{product.product_name}</p>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-2">
          <p className="text-green-700 font-bold text-sm">
            ₹{product.price} <span className="text-gray-400 font-normal text-xs">/ {product.unit}</span>
          </p>
          <p className={`text-xs font-semibold ${outOfStock ? "text-red-500" : "text-gray-400"}`}>
            {outOfStock ? "Out of Stock" : `${product.stock} left`}
          </p>
        </div>

        <div className="flex gap-2 mt-3">
          {/* Button A: Icon-Only Button */}
          <button
            onClick={handleAddToCart}
            disabled={outOfStock || adding}
            title="Add to Cart"
            className="flex-1 h-10 shimmer-button text-white rounded-xl disabled:opacity-40 disabled:pointer-events-none active:scale-95 shadow-sm flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
          </button>
          {/* Button B: Short Text-Only Button */}
          <Link
            to={`/product/${product.id}`}
            className="flex-1 h-10 border-2 border-green-600 text-green-700 text-xs font-extrabold rounded-xl text-center hover:bg-green-50 active:scale-95 transition-all duration-150 shadow-sm flex items-center justify-center"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;