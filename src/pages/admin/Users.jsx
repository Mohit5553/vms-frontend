export default function Users() {
  return (
    <div className="p-6">
      <h1>User Management</h1>

      <table className="w-full border mt-4">
        <tr>
          <th>Email</th>
          <th>Role</th>
        </tr>
        <tr>
          <td>user@test.com</td>
          <td>Customer</td>
        </tr>
      </table>
    </div>
  );
}
