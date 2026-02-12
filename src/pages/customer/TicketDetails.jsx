import CommentBox from "../../components/CommentBox";

export default function TicketDetails() {
  return (
    <div className="p-6">
      <h1 className="text-xl">Ticket #TCK-12345</h1>

      <p>Status: In Progress</p>

      <CommentBox />
    </div>
  );
}
