import api from "./axios";

export const placeOrder = (addressId, paymentMethod) =>
  api.post("/orders", { address_id: addressId, payment_method: paymentMethod });

export const getOrderDetails = (orderId) => api.get(`/orders/${orderId}`);