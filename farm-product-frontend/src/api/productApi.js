import api from "./axios";

export const getCategories = () => api.get("/categories");

export const getProductsByCategory = (categoryId) =>
  api.get(`/categories/${categoryId}/products`);

export const getFeaturedProducts = () => api.get("/products/featured");

export const getPopularProducts = () => api.get("/products/popular");

export const searchProducts = (query) =>
  api.get("/products/search", { params: { q: query } });

export const getProductById = (productId) => api.get(`/products/${productId}`);

export const getRelatedProducts = (productId) =>
  api.get(`/products/${productId}/related`);