import api from "./axios";

export const getCartItems = () => api.get("/cart");

export const addToCart = (productId, quantity) =>
  api.post("/cart", { product_id: productId, quantity });

export const updateCartItem = (cartId, quantity) =>
  api.put(`/cart/${cartId}`, { quantity });

export const removeCartItem = (cartId) => api.delete(`/cart/${cartId}`);