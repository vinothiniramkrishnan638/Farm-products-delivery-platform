import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { getAdminOrderDetails, updateOrderStatus, assignDeliveryPartner } from "../../api/adminApi";

const statusOptions = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [deliveryPartner, setDeliveryPartner] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminOrderDetails(orderId);
      setOrder(res.data);
      setNewStatus(res.data.order_status);
      setDeliveryPartner(res.data.delivery_partner_name || "");
    } catch (err) {
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setSaving(true);
      setError("");
      await updateOrderStatus(orderId, newStatus);
      setSuccessMsg("Order status updated successfully.");
      await loadOrder();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignDelivery = async () => {
    if (!deliveryPartner.trim()) {
      setError("Please enter a delivery partner name.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await assignDeliveryPartner(orderId, deliveryPartner);
      setSuccessMsg("Delivery partner assigned successfully.");
      await loadOrder();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to assign delivery partner.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Loading order details..." />;

  return (
    <div>
      <button
        onClick={() => navigate("/admin/dashboard/orders")}
        className="text-green-700 hover:text-green-800 font-bold text-sm bg-green-50 px-3 py-1.5 rounded-lg mb-5 w-fit"
      >
        ← Back to Orders
      </button>

      {successMsg && (
        <div className="bg-green-100 text-green-800 text-sm font-bold border border-green-300 rounded-xl px-4 py-3 mb-4">{successMsg}</div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      {order && (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 mb-5">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <p className="font-bold text-gray-800">{order.order_id}</p>
              <StatusBadge status={order.order_status} />
            </div>
            <div>
              <p className="text-xs text-gray-400">Customer</p>
              <p className="font-semibold text-gray-800">{order.customer_name} — {order.customer_mobile}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Delivery Address</p>
              <p className="text-sm text-gray-600">{order.delivery_address?.address}, {order.delivery_address?.village}, {order.delivery_address?.district}, {order.delivery_address?.state} - {order.delivery_address?.pincode}</p>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 mb-2">Products</p>
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.product_name} x {item.quantity}</span>
                  <span className="text-gray-800 font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
              <span>Total Amount</span>
              <span className="text-green-700">₹{order.total_amount}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Payment Method</p>
              <p className="font-semibold text-gray-800">{order.payment_method}</p>
            </div>
            {order.delivery_partner_name && (
              <div>
                <p className="text-xs text-gray-400">Assigned Delivery Partner</p>
                <p className="font-semibold text-gray-800">{order.delivery_partner_name}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <p className="font-bold text-gray-800 font-heading mb-3">Update Order Status</p>
            <div className="flex gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              >
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button
                onClick={handleUpdateStatus}
                disabled={saving}
                className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="font-bold text-gray-800 font-heading mb-3">Assign Delivery Partner</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={deliveryPartner}
                onChange={(e) => setDeliveryPartner(e.target.value)}
                placeholder="Delivery partner name"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              />
              <button
                onClick={handleAssignDelivery}
                disabled={saving}
                className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrderDetails;