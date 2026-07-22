import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import AddressCard from "../components/AddressCard";
import AddressFormModal from "../components/AddressFormModal";
import OrderSummaryCard from "../components/OrderSummaryCard";
import { getAddresses, addAddress, updateAddress, deleteAddress } from "../api/addressApi";
import { placeOrder } from "../api/orderApi";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, loading: cartLoading, loadCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setAddressLoading(true);
      setError("");
      const res = await getAddresses();
      setAddresses(res.data);
      const defaultAddr = res.data.find((a) => a.is_default);
      setSelectedAddressId(defaultAddr ? defaultAddr.id : res.data[0]?.id || null);
    } catch (err) {
      setError("Failed to load addresses. Please try again.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleSaveAddress = async (formData, addressId) => {
    if (addressId) {
      await updateAddress(addressId, formData);
      setSuccessMsg("Address updated successfully! ✓");
      setTimeout(() => setSuccessMsg(""), 3500);
    } else {
      await addAddress(formData);
    }
    setShowModal(false);
    setEditingAddress(null);
    await loadAddresses();
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId);
      await loadAddresses();
    } catch (err) {
      setError("Failed to delete address. Please try again.");
    }
  };

  const handleSetDefault = async (address) => {
    try {
      await updateAddress(address.id, { ...address, is_default: true });
      await loadAddresses();
    } catch (err) {
      setError("Failed to set default address. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    try {
      setPlacingOrder(true);
      setError("");
      const res = await placeOrder(selectedAddressId, paymentMethod);
      await loadCart();
      navigate(`/order-success/${res.data.order_id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  const loading = cartLoading || addressLoading;

  return (
    <div className="min-h-screen bg-[#fafbfa] flex flex-col page-fade-in">
      <Header />
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        <h1 className="text-2xl font-extrabold text-gray-800 font-heading mb-5">Checkout</h1>

        {loading && <Loader text="Loading checkout..." />}

        {successMsg && (
          <div className="bg-green-100 text-green-800 text-sm font-bold border border-green-300 rounded-xl px-4 py-3 mb-4 animate-bounce-in flex items-center justify-between shadow-sm">
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {!loading && (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-800 font-heading">Delivery Address</p>
                <button
                  onClick={() => {
                    setEditingAddress(null);
                    setShowModal(true);
                  }}
                  className="text-sm font-semibold text-green-700 hover:underline"
                >
                  + Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8 bg-white rounded-xl border border-gray-100">
                  No saved addresses. Add one to continue.
                </p>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      selected={selectedAddressId === address.id}
                      onSelect={setSelectedAddressId}
                      onDeselect={() => setSelectedAddressId(null)}
                      onEdit={(addr) => {
                        setEditingAddress(addr);
                        setShowModal(true);
                      }}
                      onDelete={handleDeleteAddress}
                      onSetDefault={handleSetDefault}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <p className="font-bold text-gray-800 font-heading mb-3">Payment Method</p>
              <div className="space-y-2">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${
                    paymentMethod === "COD" ? "border-green-600 bg-green-50" : "border-gray-100 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-gray-800">Cash on Delivery (COD)</span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${
                    paymentMethod === "ONLINE" ? "border-green-600 bg-green-50" : "border-gray-100 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "ONLINE"}
                    onChange={() => setPaymentMethod("ONLINE")}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-gray-800">Online Payment</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full ml-auto">
                    Coming Soon
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <OrderSummaryCard cartItems={cartItems} />
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || cartItems.length === 0}
              className="w-full shimmer-button text-white font-bold py-3.5 rounded-2xl shadow-sm disabled:opacity-50 disabled:pointer-events-none"
            >
              {placingOrder ? "Placing Order..." : "Order"}
            </button>
          </>
        )}
      </div>

      {showModal && (
        <AddressFormModal
          existingAddress={editingAddress}
          onClose={() => {
            setShowModal(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
        />
      )}

      <Footer />
    </div>
  );
};

export default Checkout;