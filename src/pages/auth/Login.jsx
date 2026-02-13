import React, { useState, useContext } from "react";
// import axios from "axios";
import api from "../../api/axios";

import { AuthContext } from "../../contextAuth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {

      const res = await api.post("/auth/login", form);

      saveToken(res.data.token, res.data.user);

      setMessage("Login successful!");
      setForm({ email: "", password: "" });

      // Role-based navigation
      const role = res.data.user.role;
      if (role === "customer") {
        navigate("/customer");
      } else if (role === "agent") {
        navigate("/agent");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/login"); // fallback
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 border rounded shadow bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {message && <p className="mb-4 text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Login
          </button>
        </form>

        {/* Links for Forgot Password and Register */}
        <div className="mt-6 flex justify-between text-sm">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline"
            onClick={() => setMessage("")}
          >
            Forgot Password?
          </Link>
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
            onClick={() => setMessage("")}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
