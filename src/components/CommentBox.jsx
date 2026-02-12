export default function CommentBox() {
  return (
    <div className="mt-4">
      <textarea className="border p-2 w-full" placeholder="Add comment" />
      <button className="bg-blue-600 text-white px-4 py-1 mt-2 rounded">
        Send
      </button>
    </div>
  );
}
