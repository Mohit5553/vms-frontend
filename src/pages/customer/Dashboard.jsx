import React from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mb-6">My Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Tickets" value="12" />
        <StatCard title="Open Tickets" value="4" />
        <StatCard title="In Progress" value="3" />
        <StatCard title="Resolved" value="5" />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Ticket Status Breakdown */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Ticket Status</h2>
          <StatusRow label="New" value={2} />
          <StatusRow label="Assigned" value={1} />
          <StatusRow label="In Progress" value={3} />
          <StatusRow label="Awaiting Response" value={1} />
          <StatusRow label="Resolved" value={5} />
        </div>

        {/* Priority Breakdown */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Ticket Priority</h2>
          <StatusRow label="Low" value={3} />
          <StatusRow label="Medium" value={4} />
          <StatusRow label="High" value={3} />
          <StatusRow label="Critical" value={2} />
        </div>

        {/* Notifications */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Notifications</h2>

          <Notification text="Your ticket TCK-1042 is In Progress" />
          <Notification text="Agent replied on ticket TCK-1039" />
          <Notification text="Ticket TCK-1035 was resolved" />
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="border rounded p-4 mb-8">
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
              id="TCK-1042"
              subject="Unable to login"
              priority="High"
              status="In Progress"
            />
            <TicketRow
              id="TCK-1041"
              subject="Payment issue"
              priority="Critical"
              status="Assigned"
            />
            <TicketRow
              id="TCK-1039"
              subject="UI bug on dashboard"
              priority="Medium"
              status="Resolved"
            />
            <TicketRow
              id="TCK-1035"
              subject="Feature request"
              priority="Low"
              status="Closed"
            />
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/create_ticket")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create New Ticket
        </button>

        <button
          onClick={() => navigate("/my_tickets")}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          View All Tickets
        </button>
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

function StatusRow({ label, value }) {
  return (
    <div className="flex justify-between mb-2">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Notification({ text }) {
  return <div className="text-sm mb-2 bg-blue-50 p-2 rounded">{text}</div>;
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
