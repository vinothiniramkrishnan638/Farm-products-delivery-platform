import api from "./axios";

export const adminLogin = (loginId, password) =>
  api.post("/admin/login", { login_id: loginId, password });

export const getAdminProfile = () => api.get("/admin/profile");

export const getDashboardSummary = () => api.get("/admin/dashboard-summary");

export const getAdminCategories = () => api.get("/admin/categories");
export const addAdminCategory = (data) => api.post("/admin/categories", data);
export const updateAdminCategory = (id, data) => api.put(`/admin/categories/${id}`, data);
export const deleteAdminCategory = (id) => api.delete(`/admin/categories/${id}`);
export const toggleCategoryStatus = (id) => api.put(`/admin/categories/${id}/toggle-status`);

export const getAdminProducts = () => api.get("/admin/products");
export const addAdminProduct = (data) => api.post("/admin/products", data);
export const updateAdminProduct = (id, data) => api.put(`/admin/products/${id}`, data);
export const deleteAdminProduct = (id) => api.delete(`/admin/products/${id}`);
export const updateProductStock = (id, stock) => api.put(`/admin/products/${id}/stock`, { stock });
export const toggleProductStatus = (id) => api.put(`/admin/products/${id}/toggle-status`);

export const getAdminOrders = () => api.get("/admin/orders");
export const getAdminOrderDetails = (orderId) => api.get(`/admin/orders/${orderId}`);
export const updateOrderStatus = (orderId, status) =>
  api.put(`/admin/orders/${orderId}/status`, { status });
export const assignDeliveryPartner = (orderId, name) =>
  api.put(`/admin/orders/${orderId}/assign-delivery`, { delivery_partner_name: name });


export const updateEstimatedDeliveryTime = (orderId, estimatedDeliveryTime) =>
  api.put(`/admin/orders/${orderId}/estimated-delivery`, { estimated_delivery_time: estimatedDeliveryTime });
export const getOrderTimeline = (orderId) => api.get(`/admin/orders/${orderId}/timeline`);
export const cancelOrderAdmin = (orderId) => api.post(`/admin/orders/${orderId}/cancel`);
export const getAdminCustomers = () => api.get("/admin/customers");
export const toggleCustomerStatus = (customerId) =>
  api.put(`/admin/customers/${customerId}/toggle-status`);