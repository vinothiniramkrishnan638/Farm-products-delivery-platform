import api from "./axios";

export const getAddresses = () => api.get("/addresses");

export const addAddress = (data) => api.post("/addresses", data);

export const updateAddress = (addressId, data) =>
  api.put(`/addresses/${addressId}`, data);

export const deleteAddress = (addressId) =>
  api.delete(`/addresses/${addressId}`);