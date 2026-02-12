import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contextAuth/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/admin"
            className="text-xl font-semibold text-blue-600 hover:text-blue-700"
          >
            Video Advertisements System
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Menu */}
          <div
            className={`${menuOpen ? "block" : "hidden"
              } md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent border-t md:border-0`}
          >
            <div className="flex flex-col md:flex-row p-4 md:p-0 gap-4">
              {/* Public */}
              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Register
                  </Link>
                </>
              )}

              {/* Authenticated */}
              {user && (
                <>
                  {/* MAIN LIST LINKS */}
                  <Link
                    to="/companies"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Company
                  </Link>

                  <Link
                    to="/locations"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Locations
                  </Link>
                  <Link
                    to="/devices"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Device
                  </Link>
                  <Link
                    to="/advertisements"
                    onClick={() => setMenuOpen(false)}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Advertisements
                  </Link>

                  {/* Dashboards */}
                  {user.role === "customer" && (
                    <Link
                      to="/customer"
                      onClick={() => setMenuOpen(false)}
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Customer Dashboard
                    </Link>
                  )}

                  {user.role === "agent" && (
                    <Link
                      to="/agent"
                      onClick={() => setMenuOpen(false)}
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Agent Dashboard
                    </Link>
                  )}

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
