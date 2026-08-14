import api from "./axios";

export const placeOrder = (addressId, paymentMethod) =>
  api.post("/orders", { address_id: addressId, payment_method: paymentMethod });

export const getOrderDetails = (orderId) => api.get(`/orders/${orderId}`);

export const getCustomerOrders = () => api.get("/my-orders");

export const trackOrderStatus = (orderId) => api.get(`/orders/${orderId}/track`);

export const cancelOrder = (orderId) => api.post(`/orders/${orderId}/cancel`);

export const reorderOrder = (orderId) => api.post(`/orders/${orderId}/reorder`);

export const getOrderHistory = () => api.get("/order-history");