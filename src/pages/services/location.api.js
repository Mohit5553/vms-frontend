import axios from "axios";

const API = "http://localhost:5000/api/location";

export const createLocation = (data) => axios.post(`${API}/create`, data);

export const getLocationsByCompany = (companyId) =>
  axios.get(`${API}/list/${companyId}`);

export const getLocationById = (id) => axios.get(`${API}/details/${id}`);

export const updateLocation = (id, data) =>
  axios.put(`${API}/edit/${id}`, data);

export const deleteLocation = (id) => axios.delete(`${API}/delete/${id}`);
