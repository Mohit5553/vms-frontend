
import api from "../../api/axios";

export const getAdminDashboardStats = () => {
  return api.get("/admin/dashboard");
};
