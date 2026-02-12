import React, { useEffect, useState } from "react";
import { getTickets } from "../../services/ticketService";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("All");

  useEffect(() => {
    getTickets().then((res) => {
      setTickets(res.data.data || []);
    });
  }, []);

  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketId.toLowerCase().includes(search.toLowerCase());

    const matchPriority = priority === "All" || t.priority === priority;
    return matchSearch && matchPriority;
  });

  const priorityCount = (p) => tickets.filter((t) => t.priority === p).length;

  const priorityColor = {
    Low: "bg-green-400",
    Medium: "bg-yellow-400",
    High: "bg-red-400",
    Critical: "bg-purple-400",
  };

  const statusColor = {
    Open: "bg-blue-100 text-blue-600",
    "In Progress": "bg-yellow-100 text-yellow-700",
    Resolved: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <h1 className="text-xl font-semibold mb-6">📂 All Tickets</h1>

      {/* Mini Graph / Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {["Low", "Medium", "High", "Critical"].map((p) => (
          <div
            key={p}
            className="bg-white/70 backdrop-blur rounded-xl p-4 border"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500">{p} Priority</p>
              <span className="text-sm font-semibold">{priorityCount(p)}</span>
            </div>

            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${priorityColor[p]}`}
                style={{
                  width: `${
                    tickets.length
                      ? (priorityCount(p) / tickets.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          placeholder="Search ticket..."
          className="p-2 border rounded-lg text-sm w-full md:w-1/2 bg-white/70"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded-lg text-sm w-full md:w-1/4 bg-white/70"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </div>

      {/* Ticket Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTickets.map((t) => (
          <div
            key={t._id}
            className="bg-white/80 backdrop-blur rounded-2xl p-5 border hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400">{t.ticketId}</span>

              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  statusColor[t.status || "Open"]
                }`}
              >
                {t.status || "Open"}
              </span>
            </div>

            <h3 className="font-medium text-sm mb-1 text-gray-800">
              {t.subject}
            </h3>

            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
              {t.description}
            </p>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{t.category}</span>

              <span className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    priorityColor[t.priority]
                  }`}
                />
                {t.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <p className="text-sm text-gray-500 mt-10 text-center">
          No tickets found
        </p>
      )}
    </div>
  );
}
