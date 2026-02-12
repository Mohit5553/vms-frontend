import axios from "axios";

const API = "http://localhost:5000/api/tickets";
const user = JSON.parse(localStorage.getItem("user")); // user object with _id, token, etc.
const token = localStorage.getItem("token");

// export const createTicket = (data) => axios.post(`${API}/create`, data);

export const createTicket = async (ticketData) => {
  const token = localStorage.getItem("token"); // or from context/state

  return await axios.post(
    "http://localhost:5000/api/tickets/create",
    ticketData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getTickets = () => {
  const token = localStorage.getItem("token"); // get token from storage

  return axios.get(`${API}/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
