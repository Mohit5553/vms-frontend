import { useContext } from "react";
import { AuthContext } from "../contextAuth/AuthContext";
import Login from "../pages/auth/Login";

export default function ProtectedRoute({ children, role }) {
  const { token, user } = useContext(AuthContext);

  if (!token) return <Login />;
  if (role && user?.role !== role)
    return <h1 className="text-center mt-10">Access Denied</h1>;

  return children;
}
