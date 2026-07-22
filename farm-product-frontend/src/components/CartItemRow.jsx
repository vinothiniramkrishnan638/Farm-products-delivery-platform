import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import countryChicken from "../assets/country_chicken.jpg";
import countryEggs from "../assets/country_eggs.jpg";
import freshWaterPrawn from "../assets/fresh_water_prawn.jpg";
import goatMilk from "../assets/goat_milk.jpg";

const CartItemRow = ({ item, onUpdateQuantity, onRemove }) => {
  const [imgError, setImgError] = useState(false);
  const subtotal = (item.price * item.quantity).toFixed(2);
  const isMaxStock = item.stock != null && item.quantity >= item.stock;

  const getProductImage = () => {
    if (item.product_name) {
      const name = item.product_name.toLowerCase();
      if (name.includes("country chicken")) return countryChicken;
      if (name.includes("country eggs") || name.includes("county eggs")) return countryEggs;
      if (name.includes("fresh water prawn")) return freshWaterPrawn;
      if (name.includes("goat milk")) return goatMilk;
    }
    return item.product_image;
  };

  return (
    <div className="flex flex-col bg-white rounded-xl border border-gray-100 p-3 shadow-sm gap-2">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
          {!imgError && getProductImage() ? (
            <img
              src={getProductImage()}
              alt={item.product_name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs">No Image</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{item.product_name}</p>
          <p className="text-xs text-gray-400">₹{item.price} / {item.unit}</p>
          <p className="text-sm font-bold text-green-700 mt-1">Subtotal: ₹{subtotal}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <QuantitySelector
            quantity={item.quantity}
            max={item.stock}
            onIncrease={() => onUpdateQuantity(item.cart_id, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item.cart_id, item.quantity - 1)}
          />
          <button
            onClick={() => onRemove(item.cart_id)}
            className="text-xs text-red-500 font-semibold hover:underline"
          >
            Remove
          </button>
        </div>
      </div>

      {isMaxStock && (
        <div className="bg-amber-50 border border-amber-200/70 text-amber-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 self-end animate-pulse">
          <span>⚠️</span>
          <span>Max stock limit reached (All {item.stock} {item.unit || "unit"}(s) added)</span>
        </div>
      )}
    </div>
  );
};

export default CartItemRow;