const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_THRESHOLD = 500;
const DISCOUNT = 0;

const OrderSummaryCard = ({ cartItems }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = itemTotal >= FREE_DELIVERY_THRESHOLD || itemTotal === 0 ? 0 : DELIVERY_CHARGE;
  const grandTotal = itemTotal - DISCOUNT + deliveryCharge;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="font-bold text-gray-800 mb-3 font-heading">Order Summary</p>

      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
        {cartItems.map((item) => (
          <div key={item.cart_id} className="flex justify-between text-sm">
            <div className="flex-1 min-w-0">
              <p className="text-gray-700 font-medium truncate">{item.product_name}</p>
              <p className="text-xs text-gray-400">Qty: {item.quantity} x ₹{item.price}</p>
            </div>
            <p className="text-gray-800 font-semibold ml-2">₹{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Total Items</span>
          <span className="font-semibold">{totalItems}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Item Total</span>
          <span className="font-semibold">₹{itemTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Delivery Charge</span>
          <span className="font-semibold">
            {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Discount</span>
          <span className="font-semibold">₹{DISCOUNT.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-100 pt-2 flex justify-between text-gray-800 font-bold text-base">
          <span>Grand Total</span>
          <span className="text-green-700">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;