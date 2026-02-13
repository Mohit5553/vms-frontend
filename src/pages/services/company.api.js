// import axios from "axios";

// const API = "http://localhost:5000/api/company";

// export const getCompanies = (params) => axios.get(`${API}/list`, { params });

// export const getCompanyById = (id) => axios.get(`${API}/details/${id}`);

// export const createCompany = (data) => axios.post(`${API}/create`, data);

// export const updateCompany = (id, data) => axios.put(`${API}/edit/${id}`, data);

// export const deleteCompany = (id) => axios.delete(`${API}/delete/${id}`);

import api from "../../api/axios";

// =============================
// Get All Companies
// =============================
export const getCompanies = (params) =>
    api.get("/company/list", { params });

// =============================
// Get Company By ID
// =============================
export const getCompanyById = (id) =>
    api.get(`/company/details/${id}`);

// =============================
// Create Company
// =============================
export const createCompany = (data) =>
    api.post("/company/create", data);

// =============================
// Update Company
// =============================
export const updateCompany = (id, data) =>
    api.put(`/company/edit/${id}`, data);

// =============================
// Delete Company
// =============================
export const deleteCompany = (id) =>
    api.delete(`/company/delete/${id}`);
