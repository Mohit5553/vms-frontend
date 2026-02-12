import axios from "axios";

const API = "http://localhost:5000/api/company";

export const getCompanies = (params) => axios.get(`${API}/list`, { params });

export const getCompanyById = (id) => axios.get(`${API}/details/${id}`);

export const createCompany = (data) => axios.post(`${API}/create`, data);

export const updateCompany = (id, data) => axios.put(`${API}/edit/${id}`, data);

export const deleteCompany = (id) => axios.delete(`${API}/delete/${id}`);
