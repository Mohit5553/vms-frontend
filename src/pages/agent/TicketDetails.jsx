export default function AgentTicketDetails() {
  return (
    <div className="p-6">
      <h2>Ticket Details</h2>

      <select className="border p-2 mb-2">
        <option>Assigned</option>
        <option>In Progress</option>
        <option>Awaiting Customer</option>
        <option>Resolved</option>
      </select>

      <textarea className="border p-2 w-full" placeholder="Internal Note" />
    </div>
  );
}
