import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AssignedTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAssignedTickets() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/tickets/list",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("resposne data is --------------", response);

        // Assuming your API response shape is: { tickets: [...] }
        setTickets(response.data.data);

        setLoading(false);
      } catch (err) {
        setError("Failed to load assigned tickets");
        setLoading(false);
      }
    }

    fetchAssignedTickets();
  }, []);

  if (loading) return <div>Loading assigned tickets...</div>;
  if (error) return <div>{error}</div>;
  if (tickets.length === 0) return <div>No assigned tickets found.</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">Assigned Tickets</h1>

      <div className="overflow-auto max-h-[80vh] border rounded bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-2">Ticket ID</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                className="border-b last:border-b-0 cursor-pointer hover:bg-gray-100"
              >
                <td className="p-2">{ticket.ticketId}</td>
                <td className="p-2">{ticket.subject}</td>
                <td className="p-2">{ticket.priority}</td>
                <td className="p-2">{ticket.category}</td>
                <td className="p-2">{ticket.status || "Assigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
