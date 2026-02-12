import axios from "axios";

const API = "http://localhost:5000/api/advertisement";

export const createAdvertisement = (data) =>
  axios.post(`${API}/create`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateAdvertisement = (id, data) =>
  axios.put(`${API}/edit/${id}`, data);
export const getAdvertisementById = (id) => axios.get(`${API}/details/${id}`);
export const getAdvertisement = (id) => axios.get(`${API}/list`, { id });

export const deleteAdvertisement = (id) => axios.delete(`${API}/delete/${id}`);
