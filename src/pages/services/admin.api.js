import axios from "axios";

export const getAdminDashboardStats = () =>
  axios.get("http://localhost:5000/api/admin/dashboard");
