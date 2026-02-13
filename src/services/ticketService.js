
import api from "../api/axios";

// =============================
// Create Ticket
// =============================
export const createTicket = async (ticketData) => {
  return await api.post("/tickets/create", ticketData);
};

// =============================
// Get All Tickets
// =============================
export const getTickets = () => {
  return api.get("/tickets/list");
};
