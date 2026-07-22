import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import CartItemRow from "../components/CartItemRow";
import { useCart } from "../context/CartContext";

const DELIVERY_CHARGE = 40;
const FREE_DELIVERY_THRESHOLD = 500;

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, loadCart, updateQuantity, removeFromCart } = useCart();
  const [error, setError] = useState("");
  const [showCheckoutNote, setShowCheckoutNote] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const handleUpdateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setError("");
      await updateQuantity(cartId, newQuantity);
    } catch (err) {
      setError("Failed to update quantity. Please try again.");
    }
  };

  const handleRemove = async (cartId) => {
    try {
      setError("");
      await removeFromCart(cartId);
    } catch (err) {
      setError("Failed to remove item. Please try again.");
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = totalAmount >= FREE_DELIVERY_THRESHOLD || totalAmount === 0 ? 0 : DELIVERY_CHARGE;
  const grandTotal = totalAmount + deliveryCharge;

  return (
    <div className="min-h-screen bg-[#fafbfa] flex flex-col page-fade-in">
      <Header />
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        <h1 className="text-2xl font-extrabold text-gray-800 font-heading mb-5">Shopping Cart</h1>

        {loading && <Loader text="Loading your cart..." />}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {!loading && !error && cartItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm mb-4">Your cart is empty.</p>
            <button
              onClick={() => navigate("/customer/dashboard")}
              className="bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}

        {!loading && !error && cartItems.length > 0 && (
          <>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <CartItemRow
                  key={item.cart_id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-6">
              <p className="font-bold text-gray-800 mb-3 font-heading">Cart Summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Amount</span>
                  <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold">
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between text-gray-800 font-bold text-base">
                  <span>Grand Total</span>
                  <span className="text-green-700">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              {/* Button A: Short Text-Only Button */}
              <button
                onClick={() => navigate("/customer/dashboard")}
                className="flex-1 h-12 border-2 border-green-600 text-green-700 font-extrabold text-sm rounded-2xl hover:bg-green-50 transition-colors active:scale-95 flex items-center justify-center"
              >
                Shop
              </button>
              {/* Button B: Icon-Only Button */}
              <button
                onClick={() => navigate("/checkout")}
                title="Proceed to Checkout"
                className="flex-1 h-12 shimmer-button text-white font-bold rounded-2xl shadow-sm active:scale-95 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;