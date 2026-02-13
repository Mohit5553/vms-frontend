
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
