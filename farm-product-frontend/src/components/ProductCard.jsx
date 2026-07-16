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
    <div className="bg-white rounded-xl border border-gray-100/70 overflow-hidden flex flex-col hover-card-effect shadow-sm">
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {!imgError && getProductImage() ? (
          <img
            src={getProductImage()}
            alt={product.product_name}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain bg-gray-50 p-2 transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </div>

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
          <button
            onClick={handleAddToCart}
            disabled={outOfStock || adding}
            className="flex-1 shimmer-button text-white text-xs font-bold py-2.5 rounded-xl disabled:opacity-40 disabled:pointer-events-none active:scale-95 shadow-sm"
          >
            {added ? "Added ✓" : adding ? "Adding..." : "Add to Cart"}
          </button>
          <Link
            to={`/product/${product.id}`}
            className="flex-1 border-2 border-green-600 text-green-700 text-xs font-bold py-2.5 rounded-xl text-center hover:bg-green-50 active:scale-95 transition-all duration-150 shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;