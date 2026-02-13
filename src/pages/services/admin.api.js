// import axios from "axios";

// export const getAdminDashboardStats = () =>
//   axios.get("http://localhost:5000/api/admin/dashboard");

import api from "../../api/axios";

export const getAdminDashboardStats = () => {
  return api.get("/admin/dashboard");
};
