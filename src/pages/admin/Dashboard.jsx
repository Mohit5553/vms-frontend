import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboardStats } from "../services/admin.api";
import api from "../../api/axios";
import { SOCKET_BASE_URL } from "../../config";
import { io } from "socket.io-client";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveScreens, setLiveScreens] = useState([]);
  const lastUpdateRef = useRef({}); // ✅ MOVE HERE
  const videoRefs = useRef({});
  const groupedScreens = liveScreens.reduce((acc, screen) => {
    const company = screen.companyName || "Unknown Company";

    if (!acc[company]) acc[company] = [];

    acc[company].push(screen);

    return acc;
  }, {});

  /* ===============================
     Fetch Dashboard Stats
  =============================== */
  useEffect(() => {
    getAdminDashboardStats()
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error("Stats error:", err))
      .finally(() => setLoading(false));
  }, []);


  useEffect(() => {
    liveScreens.forEach((screen) => {
      const video = videoRefs.current[screen.deviceId];

      if (
        video &&
        screen.currentVideo &&
        screen.currentTime &&
        Math.abs(video.currentTime - screen.currentTime) > 1
      ) {
        video.currentTime = screen.currentTime;
      }
    });
  }, [liveScreens]);
  /* ===============================
     Fetch Live Screens (Auto Refresh)
  =============================== */
  useEffect(() => {
    const fetchLiveScreens = async () => {
      try {
        const res = await api.get("/admin/live-screens");
        setLiveScreens(res.data.data || []);
      } catch (err) {
        console.error("Live screens error:", err);
      }
    };

    fetchLiveScreens();

    const socket = io(SOCKET_BASE_URL, {
      transports: ["websocket"],
    });

    socket.on("live_screens_update", (data) => {
      setLiveScreens((prev) => {
        return data.map((screen) => {
          const prevScreen = lastUpdateRef.current[screen.deviceId];

          if (
            prevScreen &&
            prevScreen.currentVideo === screen.currentVideo &&
            Math.abs((prevScreen.currentTime || 0) - (screen.currentTime || 0)) < 1
          ) {
            return prevScreen;
          }

          lastUpdateRef.current[screen.deviceId] = screen;
          return screen;
        });
      });
    });

    return () => socket.disconnect();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

      {/* ===============================
          Stats Section
      =============================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Companies" value={stats.companies || 0} />
        <StatCard title="Locations" value={stats.locations || 0} />
        <StatCard title="Advertisements" value={stats.advertisements || 0} />
        <StatCard
          title="Active Screens"
          value={stats.activeScreens || 0}
          highlight
        />
      </div>

      {/* ===============================
          Live Video Grid
      =============================== */}
      <div className="mt-8 bg-white p-6 rounded shadow border">
        <h2 className="text-2xl font-semibold mb-4">
          Live Videos ({liveScreens.length})
        </h2>

        {liveScreens.length === 0 ? (
          <p className="text-gray-500">No live screens currently.</p>
        ) : (
          <div>
            {Object.entries(groupedScreens).map(([company, screens]) => (
              <div key={company} className="mb-10">

                {/* 🔥 Company header */}
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold text-blue-700">
                    {company}
                  </h3>

                  <span className="text-sm text-gray-500">
                    Screens: {screens.length}
                  </span>
                </div>

                {/* 🔥 Screens grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {screens.map((screen) => (
                    <div
                      key={screen.deviceId}
                      className="border rounded shadow bg-white p-3"
                    >
                      {screen.currentVideo === "PAUSED" ? (
                        <div className="w-full h-56 bg-yellow-500 flex items-center justify-center text-white font-bold">
                          ⏸ Paused
                        </div>
                      ) : screen.currentVideo ? (
                        <video
                          ref={(el) => {
                            if (!el) return;

                            videoRefs.current[screen.deviceId] = el;

                            const src = `${SOCKET_BASE_URL}${screen.currentVideo}`;

                            if (el.src !== src) {
                              el.src = src;
                            }

                            if (
                              screen.currentTime &&
                              Math.abs(el.currentTime - screen.currentTime) > 1
                            ) {
                              el.currentTime = screen.currentTime;
                            }

                            if (el.paused) {
                              el.play().catch(() => { });
                            }
                          }}
                          muted
                          autoPlay
                          playsInline
                          className="w-full h-56 object-contain bg-black"
                        />
                      ) : (
                        <div className="w-full h-56 bg-gray-500 flex items-center justify-center text-white">
                          Inactive
                        </div>
                      )}

                      <div className="mt-2 text-center">
                        <p className="font-semibold">
                          {screen.locationName || "Unknown Location"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Device: {screen.deviceId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ===============================
          Quick Actions
      =============================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <QuickLink title="Manage Companies" to="/companies" />
        <QuickLink title="Manage Locations" to="/locations" />
        <QuickLink title="Manage Advertisements" to="/advertisements" />
      </div>
    </div>
  );
}

/* ===============================
   Components
================================ */

const StatCard = ({ title, value, highlight }) => (
  <div
    className={`p-6 rounded shadow bg-white border ${highlight ? "border-green-500" : "border-gray-200"
      }`}
  >
    <p className="text-gray-500 text-sm mb-1">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

const QuickLink = ({ title, to }) => (
  <Link
    to={to}
    className="p-6 bg-white rounded shadow border border-gray-200 hover:border-blue-500 transition"
  >
    <p className="text-lg font-medium text-blue-600">{title}</p>
    <p className="text-sm text-gray-500 mt-1">View & manage</p>
  </Link>
);
