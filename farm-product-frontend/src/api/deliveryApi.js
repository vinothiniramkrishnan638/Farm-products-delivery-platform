import api from "./axios";

export const deliveryLogin = (loginId, password) =>
  api.post("/delivery/login", { login_id: loginId, password });

export const getDeliveryProfile = () => api.get("/delivery/profile");

export const getDeliveryDashboardSummary = () => api.get("/delivery/dashboard-summary");

export const getMyAssignedOrders = () => api.get("/delivery/assigned-orders");

export const updateDeliveryAssignmentStatus = (assignmentId, status) =>
  api.put(`/delivery/assignments/${assignmentId}/status`, { status });

export const getDeliveryHistory = () => api.get("/delivery/history");

export const getDeliveryPartners = () => api.get("/admin/delivery-partners");

export const addDeliveryPartner = (data) => api.post("/admin/delivery-partners", data);

export const updateDeliveryPartner = (partnerId, data) =>
  api.put(`/admin/delivery-partners/${partnerId}`, data);

export const toggleDeliveryPartnerStatus = (partnerId) =>
  api.put(`/admin/delivery-partners/${partnerId}/toggle-status`);

export const assignOrderToPartner = (orderId, partnerId) =>
  api.post("/admin/delivery-assignments", { order_id: orderId, delivery_partner_id: partnerId });

export const getPartnerAssignedOrders = (partnerId) =>
  api.get(`/admin/delivery-partners/${partnerId}/assigned-orders`);