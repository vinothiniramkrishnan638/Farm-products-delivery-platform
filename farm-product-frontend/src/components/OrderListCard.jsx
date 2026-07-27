import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StatusBadge from "./StatusBadge";
import countryChicken from "../assets/country_chicken.jpg";
import countryEggs from "../assets/country_eggs.jpg";
import freshWaterPrawn from "../assets/fresh_water_prawn.jpg";
import goatMilk from "../assets/goat_milk.jpg";

const OrderListCard = ({ order }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const firstItem = order.items?.[0];
  const totalQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const extraItemsCount = (order.items?.length || 0) - 1;

  const getProductImage = () => {
    if (firstItem?.product_name) {
      const name = firstItem.product_name.toLowerCase();
      if (name.includes("country chicken")) return countryChicken;
      if (name.includes("country eggs") || name.includes("county eggs")) return countryEggs;
      if (name.includes("fresh water prawn")) return freshWaterPrawn;
      if (name.includes("goat milk")) return goatMilk;
    }
    return firstItem?.product_image;
  };

  return (
    <div
      onClick={() => navigate(`/order-details/${order.order_id}`)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-green-200 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs text-gray-400">Order ID</p>
          <p className="font-bold text-gray-800">{order.order_id}</p>
        </div>
        <StatusBadge status={order.order_status} />
      </div>

      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
          {!imgError && getProductImage() ? (
            <img
              src={getProductImage()}
              alt={firstItem?.product_name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-[10px]">No Image</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {firstItem?.product_name}
            {extraItemsCount > 0 && (
              <span className="text-gray-400 font-normal"> +{extraItemsCount} more</span>
            )}
          </p>
          <p className="text-xs text-gray-400">Qty: {totalQuantity}</p>
          <p className="text-xs text-gray-400">{order.created_at}</p>
        </div>

        <div className="text-right shrink-0">
          <p className="font-bold text-green-700">₹{order.total_amount}</p>
          <p className="text-xs text-gray-400">
            {order.payment_method === "COD" ? "COD" : "Online"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderListCard;