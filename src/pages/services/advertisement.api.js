// import axios from "axios";

// const API = "http://localhost:5000/api/advertisement";

// export const createAdvertisement = (data) =>
//   axios.post(`${API}/create`, data, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// export const updateAdvertisement = (id, data) =>
//   axios.put(`${API}/edit/${id}`, data);
// export const getAdvertisementById = (id) => axios.get(`${API}/details/${id}`);
// export const getAdvertisement = (id) => axios.get(`${API}/list`, { id });

// export const deleteAdvertisement = (id) => axios.delete(`${API}/delete/${id}`);


import api from "../../api/axios";

// =============================
// Create Advertisement
// =============================
export const createAdvertisement = (data) =>
  api.post("/advertisement/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// =============================
// Update Advertisement
// =============================
export const updateAdvertisement = (id, data) =>
  api.put(`/advertisement/edit/${id}`, data);

// =============================
// Get Advertisement By ID
// =============================
export const getAdvertisementById = (id) =>
  api.get(`/advertisement/details/${id}`);

// =============================
// Get All Advertisements
// =============================
export const getAdvertisement = () =>
  api.get("/advertisement/list");

// =============================
// Delete Advertisement
// =============================
export const deleteAdvertisement = (id) =>
  api.delete(`/advertisement/delete/${id}`);
