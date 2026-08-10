import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Loader from "../../components/Loader";
import DeliveryPartnerFormModal from "../../components/admin/DeliveryPartnerFormModal";
import AssignOrderModal from "../../components/admin/AssignOrderModal";
import DeliveryStatusBadge from "../../components/DeliveryStatusBadge";
import {
  getDeliveryPartners,
  addDeliveryPartner,
  updateDeliveryPartner,
  toggleDeliveryPartnerStatus,
  getPartnerAssignedOrders,
} from "../../api/deliveryApi";

const AdminDeliveryManagement = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [assigningPartner, setAssigningPartner] = useState(null);
  const [viewingPartner, setViewingPartner] = useState(null);
  const [viewingOrders, setViewingOrders] = useState([]);
  const [viewingLoading, setViewingLoading] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getDeliveryPartners();
      setPartners(res.data);
    } catch (err) {
      setError("Failed to load delivery partners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData, partnerId) => {
    setError("");
    setSuccessMessage("");
    if (partnerId) {
      const existing = partners.find(p => p.id === partnerId);
      const updatedFields = [];
      if (existing) {
        if (existing.name !== formData.name) updatedFields.push("Name");
        if (existing.mobile_number !== formData.mobile_number) updatedFields.push("Mobile Number");
        if (existing.email !== formData.email) updatedFields.push("Email");
        if (formData.password) updatedFields.push("Password");
      }
      await updateDeliveryPartner(partnerId, formData);
      if (updatedFields.length > 0) {
        setSuccessMessage(`Delivery partner updated successfully. Updated fields: ${updatedFields.join(", ")}`);
      } else {
        setSuccessMessage("Delivery partner updated successfully (no fields changed).");
      }
    } else {
      await addDeliveryPartner(formData);
      setSuccessMessage(`Delivery partner '${formData.name}' added successfully.`);
    }
    setShowFormModal(false);
    setEditingPartner(null);
    await loadPartners();
  };

  const handleToggleStatus = async (partnerId) => {
    try {
      setError("");
      setSuccessMessage("");
      const partner = partners.find(p => p.id === partnerId);
      await toggleDeliveryPartnerStatus(partnerId);
      if (partner) {
        const newStatus = partner.status === "active" ? "disabled" : "active";
        setSuccessMessage(`Delivery partner '${partner.name}' availability status set to '${newStatus}' successfully.`);
      }
      await loadPartners();
    } catch (err) {
      setError("Failed to update partner status.");
    }
  };

  const handleViewAssigned = async (partner) => {
    setViewingPartner(partner);
    setViewingLoading(true);
    try {
      const res = await getPartnerAssignedOrders(partner.id);
      setViewingOrders(res.data);
    } catch (err) {
      setViewingOrders([]);
    } finally {
      setViewingLoading(false);
    }
  };

  if (loading) return <Loader text="Loading delivery partners..." />;

  return (
    <div className="page-fade-in">
      <div className="flex justify-between items-center mb-5">
        <p className="text-xl font-extrabold text-gray-800 font-heading">Delivery Partner Management</p>
        <button
          onClick={() => { setEditingPartner(null); setError(""); setSuccessMessage(""); setShowFormModal(true); }}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 text-sm flex items-center gap-1.5 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
          </svg>
          Add Partner
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm font-semibold border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</div>
      )}

      {successMessage && (
        <div className="bg-green-100 text-green-800 text-sm font-bold border border-green-300 rounded-xl px-4 py-3 mb-4 flex justify-between items-center animate-fade-in">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} className="text-green-800 hover:text-green-950 font-bold ml-2 focus:outline-none" title="Dismiss">×</button>
        </div>
      )}

      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto premium-card animate-fade-up">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-400 text-xs uppercase">
              <th className="px-4 py-3">Partner ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile Number</th>
              <th className="px-4 py-3">Assigned Orders</th>
              <th className="px-4 py-3">Availability</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((partner) => (
              <tr key={partner.id} className="border-b border-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{partner.partner_id}</td>
                <td className="px-4 py-3 text-gray-600">{partner.name}</td>
                <td className="px-4 py-3 text-gray-600">{partner.mobile_number}</td>
                <td className="px-4 py-3 text-gray-600">{partner.assigned_orders_count ?? 0}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${partner.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {partner.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => { setEditingPartner(partner); setError(""); setSuccessMessage(""); setShowFormModal(true); }}
                      className="text-xs font-semibold text-blue-600 hover:underline px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all flex items-center gap-1"
                      title="Edit Partner"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(partner.id)}
                      className={`text-xs font-semibold hover:underline px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        partner.status === "active" ? "text-amber-600 bg-amber-50 hover:bg-amber-100" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                      title={partner.status === "active" ? "Disable Partner" : "Enable Partner"}
                    >
                      {partner.status === "active" ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          Disable
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                          Enable
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setAssigningPartner(partner)}
                      className="text-xs font-semibold text-green-700 hover:underline px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-all flex items-center gap-1"
                      title="Assign Order"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
                      </svg>
                      Assign
                    </button>
                    <button
                      onClick={() => handleViewAssigned(partner)}
                      className="text-xs font-semibold text-gray-600 hover:underline px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all flex items-center gap-1"
                      title="View Assigned Orders"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {partners.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No delivery partners found.</p>}
      </div>

      {/* Mobile/Tablet view card list (visible on mobile, hidden on desktop) */}
      <div className="grid grid-cols-1 gap-4 md:hidden animate-fade-up">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-3 premium-card">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-gray-400 text-[10px] uppercase font-bold block">Partner ID</span>
                <span className="font-bold text-gray-800">{partner.partner_id}</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${partner.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {partner.status}
              </span>
            </div>

            <div className="space-y-1.5 py-2 border-t border-b border-gray-50 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Name</span>
                <span className="font-semibold text-gray-700">{partner.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Mobile</span>
                <span className="font-medium text-gray-600">{partner.mobile_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-xs">Assigned Orders</span>
                <span className="font-bold text-emerald-700">{partner.assigned_orders_count ?? 0}</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap pt-1">
              <button
                onClick={() => { setEditingPartner(partner); setError(""); setSuccessMessage(""); setShowFormModal(true); }}
                className="flex-1 text-xs font-semibold text-blue-600 hover:underline px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all flex items-center justify-center gap-1"
                title="Edit Partner"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => handleToggleStatus(partner.id)}
                className={`flex-1 text-xs font-semibold hover:underline px-2.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  partner.status === "active" ? "text-amber-600 bg-amber-50 hover:bg-amber-100" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                }`}
                title={partner.status === "active" ? "Disable Partner" : "Enable Partner"}
              >
                {partner.status === "active" ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => setAssigningPartner(partner)}
                className="flex-1 text-xs font-semibold text-green-700 hover:underline px-2.5 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition-all flex items-center justify-center gap-1"
                title="Assign Order"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5H4.5" />
                </svg>
                Assign
              </button>
              <button
                onClick={() => handleViewAssigned(partner)}
                className="flex-1 text-xs font-semibold text-gray-600 hover:underline px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-center gap-1"
                title="View Assigned Orders"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                View
              </button>
            </div>
          </div>
        ))}
        {partners.length === 0 && <p className="text-center text-gray-400 text-sm py-8 animate-fade-up">No delivery partners found.</p>}
      </div>

      {showFormModal && (
        <DeliveryPartnerFormModal
          existingPartner={editingPartner}
          onClose={() => { setShowFormModal(false); setEditingPartner(null); }}
          onSave={handleSave}
        />
      )}

      {assigningPartner && (
        <AssignOrderModal
          partner={assigningPartner}
          onClose={() => setAssigningPartner(null)}
          onAssigned={(orderId) => {
            setAssigningPartner(null);
            setSuccessMessage(`Order '${orderId}' assigned to '${assigningPartner.name}' successfully.`);
            loadPartners();
          }}
        />
      )}

      {viewingPartner && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50 animate-fade-up">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
            <p className="font-bold text-lg text-gray-800 font-heading mb-4">
              Orders Assigned to {viewingPartner.name}
            </p>
            {viewingLoading ? (
              <p className="text-gray-400 text-sm text-center py-6">Loading...</p>
            ) : viewingOrders.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No orders assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {viewingOrders.map((order) => (
                  <div key={order.assignment_id} className="flex justify-between items-center border border-gray-100 rounded-lg px-3 py-2 text-sm">
                    <span className="font-semibold text-gray-800">{order.order_id}</span>
                    <DeliveryStatusBadge status={order.delivery_status} />
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setViewingPartner(null)}
              className="w-full mt-5 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminDeliveryManagement;