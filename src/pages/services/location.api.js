

import api from "../../api/axios";

// =============================
// Create Location
// =============================
export const createLocation = (data) =>
  api.post("/location/create", data);

// =============================
// Get Locations By Company
// =============================
export const getLocationsByCompany = (companyId) =>
  api.get(`/location/list/${companyId}`);

// =============================
// Get Location By ID
// =============================
export const getLocationById = (id) =>
  api.get(`/location/details/${id}`);

// =============================
// Update Location
// =============================
export const updateLocation = (id, data) =>
  api.put(`/location/edit/${id}`, data);

// =============================
// Delete Location
// =============================
export const deleteLocation = (id) =>
  api.delete(`/location/delete/${id}`);
