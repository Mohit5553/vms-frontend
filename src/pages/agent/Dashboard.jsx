import React from "react";
import { Link } from "react-router-dom";

export default function AgentDashboard() {
  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6">Agent Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* <StatCard title="Assigned Tickets" value="25" /> */}

        <Link to="/assigned_tickets">
          <StatCard title="Assigned Tickets" value="25" />
        </Link>

        <StatCard title="In Progress" value="15" />
        <StatCard title="SLA Breached" value="3" />
        <StatCard title="Resolved" value="40" />
      </div>

      {/* Recent Tickets Table */}
      <div className="border rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Tickets</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Ticket ID</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <TicketRow
              id="TCK-1101"
              subject="System crash on login"
              priority="High"
              status="In Progress"
            />
            <TicketRow
              id="TCK-1098"
              subject="Password reset issue"
              priority="Medium"
              status="Assigned"
            />
            <TicketRow
              id="TCK-1095"
              subject="UI alignment bug"
              priority="Low"
              status="Resolved"
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Small Reusable Components ---------- */

function StatCard({ title, value }) {
  return (
    <div className="border rounded p-4 shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

function TicketRow({ id, subject, priority, status }) {
  return (
    <tr className="border-b last:border-b-0">
      <td className="p-2">{id}</td>
      <td className="p-2">{subject}</td>
      <td className="p-2">{priority}</td>
      <td className="p-2">
        <span
          className={`px-2 py-1 rounded text-sm ${
            status === "Closed"
              ? "bg-green-100 text-green-700"
              : status === "Resolved"
              ? "bg-emerald-100 text-emerald-700"
              : status === "In Progress"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {status}
        </span>
      </td>
    </tr>
  );
}
