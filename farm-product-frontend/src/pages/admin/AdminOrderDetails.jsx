import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import OrderTrackingTimeline from "../../components/OrderTrackingTimeline";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  getAdminOrderDetails,
  updateOrderStatus,
  assignDeliveryPartner,
  updateEstimatedDeliveryTime,
  cancelOrderAdmin,
} from "../../api/adminApi";
import { getDeliveryPartners, assignOrderToPartner } from "../../api/deliveryApi";

const statusOptions = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Picked Up",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const AdminOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [deliveryPartner, setDeliveryPartner] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const [partners, setPartners] = useState([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState("");

  useEffect(() => {
    loadOrder();
    loadPartners();
  }, [orderId]);

  const loadPartners = async () => {
    try {
      const res = await getDeliveryPartners();
      setPartners(res.data || []);
    } catch (err) {
      console.error("Failed to load delivery partners", err);
    }
  };

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAdminOrderDetails(orderId);

      setOrder(res.data);
      setNewStatus(res.data.order_status);
      setDeliveryPartner(res.data.delivery_partner_name || "");
      setEstimatedTime(res.data.estimated_delivery_time || "");
      
      // Match partner from list if already assigned
      if (res.data.delivery_partner_name) {
        // Wait, we will match when partners list loads, or find here
      }
    } catch (err) {
      setError("Failed to load order details.");
    } finally {
      setLoading(false);
    }
  };

  // Sync selectedPartnerId once partners list is loaded and order is loaded
  useEffect(() => {
    if (order && partners.length > 0 && order.delivery_partner_name) {
      const matched = partners.find(p => p.name === order.delivery_partner_name);
      if (matched) {
        setSelectedPartnerId(matched.id);
      }
    }
  }, [order, partners]);

  const handleUpdateStatus = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMsg("");

      await updateOrderStatus(orderId, newStatus);

      setSuccessMsg("Order status updated successfully.");

      await loadOrder();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to update status."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAssignDelivery = async () => {
    if (!selectedPartnerId) {
      setError("Please select a delivery partner.");
      return;
    }

    const originalPartnerId = order?.delivery_partner_name
      ? (partners.find(p => p.name === order.delivery_partner_name)?.id || "")
      : "";

    try {
      setSaving(true);
      setError("");
      setSuccessMsg("");

      const partner = partners.find(p => String(p.id) === String(selectedPartnerId));
      if (!partner) {
        setError("Selected delivery partner not found.");
        return;
      }

      await assignOrderToPartner(orderId, selectedPartnerId);

      setSuccessMsg("Delivery partner assigned successfully.");

      await loadOrder();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to assign delivery partner."
      );
      // Revert dropdown selection to the original assigned partner ID
      setSelectedPartnerId(originalPartnerId);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEstimatedTime = async () => {
    if (!estimatedTime.trim()) {
      setError("Please enter an estimated delivery time.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMsg("");

      await updateEstimatedDeliveryTime(orderId, estimatedTime);

      setSuccessMsg(
        "Estimated delivery time updated successfully."
      );

      await loadOrder();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to update estimated delivery time."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccessMsg("");

      await cancelOrderAdmin(orderId);

      setSuccessMsg("Order cancelled successfully.");
      setShowCancelConfirm(false);

      await loadOrder();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to cancel order."
      );

      setShowCancelConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  const canCancel =
    order &&
    order.order_status !== "Delivered" &&
    order.order_status !== "Cancelled";

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/dashboard/orders")}
        className="text-green-700 hover:text-green-800 font-bold text-sm bg-green-50 px-3 py-1.5 rounded-lg mb-5 w-fit"
      >
        ← Back to Orders
      </button>

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-100 text-green-800 text-sm font-bold border border-green-300 rounded-xl px-4 py-3 mb-4">
          {successMsg}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {order && (
        <>
          {/* Order Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 mb-5">
            {/* Order Header */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <p className="font-bold text-gray-800">
                {order.order_id}
              </p>

              <StatusBadge status={order.order_status} />
            </div>

            {/* Customer */}
            <div>
              <p className="text-xs text-gray-400">
                Customer
              </p>

              <p className="font-semibold text-gray-800">
                {order.customer_name} — {order.customer_mobile}
              </p>
            </div>

            {/* Delivery Address */}
            <div>
              <p className="text-xs text-gray-400 mb-1">
                Delivery Address
              </p>

              <p className="text-sm text-gray-600">
                {order.delivery_address?.address},{" "}
                {order.delivery_address?.village},{" "}
                {order.delivery_address?.district},{" "}
                {order.delivery_address?.state} -{" "}
                {order.delivery_address?.pincode}
              </p>
            </div>

            {/* Products */}
            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-400 mb-2">
                Products
              </p>

              {order.items?.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {item.product_name} x {item.quantity}
                  </span>

                  <span className="text-gray-800 font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total Amount */}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-800">
              <span>Total Amount</span>

              <span className="text-green-700">
                ₹{order.total_amount}
              </span>
            </div>

            {/* Payment Method */}
            <div>
              <p className="text-xs text-gray-400">
                Payment Method
              </p>

              <p className="font-semibold text-gray-800">
                {order.payment_method}
              </p>
            </div>

            {/* Delivery Partner */}
            {order.delivery_partner_name && (
              <div>
                <p className="text-xs text-gray-400">
                  Assigned Delivery Partner
                </p>

                <p className="font-semibold text-gray-800">
                  {order.delivery_partner_name}
                </p>
              </div>
            )}

            {/* Estimated Delivery Time */}
            {order.estimated_delivery_time && (
              <div>
                <p className="text-xs text-gray-400">
                  Estimated Delivery Time
                </p>

                <p className="font-semibold text-gray-800">
                  {order.estimated_delivery_time}
                </p>
              </div>
            )}
          </div>

          {/* Order Tracking */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-800 font-heading">
                Order Tracking
              </p>

              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="text-green-700 hover:text-green-800 font-semibold text-sm"
              >
                {showTimeline
                  ? "Hide Timeline"
                  : "View Timeline"}
              </button>
            </div>

            {showTimeline && (
              <div className="mt-5">
                <OrderTrackingTimeline order={order} />
              </div>
            )}
          </div>

          {/* Update Order Status */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <p className="font-bold text-gray-800 font-heading mb-3">
              Update Order Status
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                onClick={handleUpdateStatus}
                disabled={saving}
                className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Updating..." : "Update"}
              </button>
            </div>
          </div>

          {/* Assign Delivery Partner */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <p className="font-bold text-gray-800 font-heading mb-3">
              Assign Delivery Partner
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Delivery Partner</option>
                {partners.filter(p => p.status === 'active').map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <button
                onClick={handleAssignDelivery}
                disabled={saving}
                className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>

          {/* Estimated Delivery Time */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <p className="font-bold text-gray-800 font-heading mb-3">
              Estimated Delivery Time
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="Example: 30 minutes"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                onClick={handleSaveEstimatedTime}
                disabled={saving}
                className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Cancel Order */}
          {canCancel && (
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-5 mb-5">
              <p className="font-bold text-gray-800 font-heading mb-2">
                Cancel Order
              </p>

              <p className="text-sm text-gray-500 mb-3">
                You can cancel this order if it has not been
                delivered yet.
              </p>

              <button
                onClick={() => setShowCancelConfirm(true)}
                disabled={saving}
                className="bg-red-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          )}
        </>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirm && (
        <ConfirmDialog
          title="Cancel Order"
          message="Are you sure you want to cancel this order? This action cannot be undone."
          onConfirm={handleCancelOrder}
          onCancel={() => setShowCancelConfirm(false)}
          loading={saving}
        />
      )}
    </div>
  );
};

export default AdminOrderDetails;