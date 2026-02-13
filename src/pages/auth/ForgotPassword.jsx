import React, { useState } from "react";
import api from "../api/axios"; // adjust path if needed

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });

      setMessage(
        "If this email is registered, password reset instructions have been sent."
      );
      setEmail("");

    } catch (error) {
      console.error("Forgot password error:", error);
      setMessage(
        error.response?.data?.message || "Failed to send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-6 border rounded shadow bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {message && (
          <p
            className={`mb-4 text-center ${message.toLowerCase().includes("failed")
              ? "text-red-600"
              : "text-green-600"
              }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
