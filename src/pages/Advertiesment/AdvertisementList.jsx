import React, { useEffect, useState, useMemo } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  getAdvertisement,
  deleteAdvertisement,
} from "../services/advertisement.api";
import api from "../../api/axios";
import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "../../config";
import { useRef } from "react";

export default function AdvertisementList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState([]); // array of DEVICE IDs (MAC)
  const [deviceMap, setDeviceMap] = useState({});
  const [pausedDevices, setPausedDevices] = useState([]);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const socketRef = useRef(null); // ✅ ADD THIS


  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await getAdvertisement();
      setAds(res.data.data || []);
      // 🔥 Fetch all devices and create MAC → Name map

      // Load saved playing locations from sessionStorage
      const saved = sessionStorage.getItem("playingDevices");
      if (saved) setIsPlaying(JSON.parse(saved));
      const deviceRes = await api.get("/devices/list");
      const savedPause = sessionStorage.getItem("pausedDevices");
      if (savedPause) setPausedDevices(JSON.parse(savedPause));

      const map = {};
      (deviceRes.data.data || []).forEach((d) => {
        map[d.deviceId] = d; // ✅ full device
      });
      setDeviceMap(map);

    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  useEffect(() => {
    if (!SOCKET_BASE_URL) return;

    socketRef.current = io(SOCKET_BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current.on("device-status", (data) => {
      if (data?.playingDevices) {
        setIsPlaying(data.playingDevices);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this advertisement?")) return;
    await deleteAdvertisement(id);
    fetchAds();
  };
  const isLocationPlaying = (deviceIds = []) =>
    Array.isArray(deviceIds) &&
    deviceIds.length > 0 &&
    deviceIds.every((id) => isPlaying.includes(id));


  const playAllInLocation = async (companyId, locationId, deviceIds = []) => {
    try {
      // ✅ Use your EXISTING route: /advertisement/play
      for (const deviceId of deviceIds) {
        // await axios.post(`${API_URL}/advertisement/play`, {
        await api.post("/advertisement/play", {

          companyId,
          locationId,
          deviceId,
        });
      }

      setIsPlaying((prev) => {
        const updated = Array.from(new Set([...prev, ...deviceIds]));
        sessionStorage.setItem("playingDevices", JSON.stringify(updated));
        return updated;
      });
      setPausedDevices(prev => {
        const updated = prev.filter(id => !deviceIds.includes(id));
        sessionStorage.setItem("pausedDevices", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Play All Error:", error);
      alert("Play All failed — check console");
    }
  };
  const stopAllInLocation = async (companyId, locationId, deviceIds = []) => {
    try {
      await Promise.all(
        deviceIds.map((deviceId) =>
          api.post("/advertisement/stop", {
            companyId,
            deviceId,
          })
        )
      );

      // remove from playing
      setIsPlaying((prev) => {
        const updated = prev.filter((id) => !deviceIds.includes(id));
        sessionStorage.setItem("playingDevices", JSON.stringify(updated));
        return updated;
      });

      // remove from paused
      setPausedDevices((prev) => {
        const updated = prev.filter((id) => !deviceIds.includes(id));
        sessionStorage.setItem("pausedDevices", JSON.stringify(updated));
        return updated;
      });

    } catch (error) {
      console.error("Stop All Error:", error);
      alert("Stop All failed — check console");
    }
  };
  const pauseAllInLocation = async (companyId, locationId, deviceIds = []) => {
    try {
      await Promise.all(
        deviceIds.map((deviceId) =>
          api.post("/advertisement/pause", {
            companyId,
            deviceId,
          })
        )
      );

      // Add paused
      setPausedDevices((prev) => {
        const updated = Array.from(new Set([...prev, ...deviceIds]));
        sessionStorage.setItem("pausedDevices", JSON.stringify(updated));
        return updated;
      });

      // Remove playing
      setIsPlaying((prev) => {
        const updated = prev.filter((id) => !deviceIds.includes(id));
        sessionStorage.setItem("playingDevices", JSON.stringify(updated));
        return updated;
      });

    } catch (error) {
      console.error("Pause All Error:", error);
      alert("Pause failed");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(1);
  };

  // 🔍 Search
  const filteredAds = useMemo(() => {
    return ads.filter((ad) =>
      ad.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [ads, search]);

  const sortedAds = useMemo(() => {
    if (!sortField) return filteredAds;

    return [...filteredAds].sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";

      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredAds, sortField, sortDirection]);

  const paginatedAds = useMemo(() => {
    return sortedAds.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  }, [sortedAds, page]);

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 min-h-full">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">Advertisements</h2>
          <p className="text-gray-500 text-sm">
            Manage and control your advertisements
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {/* Search */}
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search advertisements..."
            className="border px-3 py-2 rounded w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Link
            to="/advertisements/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center"
          >
            + Add Advertisement
          </Link>
        </div>
      </div>

      {ads.length === 0 ? (
        <p className="text-gray-600">No advertisements found.</p>
      ) : (
        <>
          {/* Count */}
          {/* <div className="mb-2 text-sm text-gray-500">
            Showing {paginatedAds.length} of {sortedAds.length} advertisements
          </div> */}

          <div className="overflow-x-auto rounded-lg border shadow-sm bg-white">
            <table className="w-full min-w-[900px] border-collapse">
              <thead className="bg-gray-50 border-b sticky top-0 z-10">
                <tr>
                  <th
                    onClick={() => handleSort("title")}
                    className="cursor-pointer p-3 text-xs font-semibold uppercase tracking-wide text-gray-600 border text-left"
                  >
                    Title{" "}
                    {sortField === "title" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-600 border text-left">
                    Company
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-600 border text-left">
                    Location
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-600 border text-left">
                    Screen URL
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-600 border text-left">
                    Devices
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-600 border text-left">
                    Status
                  </th>
                  <th className="p-3 text-xs font-semibold uppercase tracking-wide text-gray-600 border text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedAds.map((ad) => (
                  <tr
                    key={ad._id}
                    className="hover:bg-blue-50 transition"
                  >
                    {/* Title */}
                    <td className="p-2 border text-sm">{ad.title}</td>

                    {/* Company */}
                    <td className="p-2 border text-sm">
                      {Array.isArray(ad.company_ids) &&
                        ad.company_ids.length > 0
                        ? ad.company_ids.map((c) => c.name).join(", ")
                        : "-"}
                    </td>

                    {/* Location */}
                    <td className="p-2 border text-sm">
                      {Array.isArray(ad.location_ids) &&
                        ad.location_ids.length > 0
                        ? ad.location_ids.map((l) => l.name).join(", ")
                        : "-"}
                    </td>

                    {/* Screen URL */}
                    <td className="p-2 border text-sm">
                      <div className="flex flex-col gap-1 max-w-[220px]">
                        {Array.isArray(ad.deviceId) &&
                          ad.deviceId.map((mac) => {
                            const device = deviceMap[mac];
                            if (!device?.screenToken) return null;

                            return (
                              <a
                                key={mac}
                                href={`${window.location.origin}/screen/${device.screenToken}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple-600 hover:underline break-all"
                              >
                                /screen/{device.screenToken}
                              </a>
                            );
                          })}
                      </div>
                    </td>

                    {/* Devices */}
                    <td className="p-2 border text-sm">
                      {Array.isArray(ad.deviceId) && ad.deviceId.length > 0
                        ? ad.deviceId
                          .map(
                            (mac) =>
                              deviceMap[mac]?.deviceName || mac
                          )
                          .join(", ")
                        : "-"}
                    </td>

                    {/* Status */}
                    <td className="p-2 border">
                      {(() => {
                        const deviceIds = ad.deviceId || [];

                        const isAnyPaused = deviceIds.some((d) =>
                          pausedDevices.includes(d)
                        );

                        const isAnyPlaying = deviceIds.some((d) =>
                          isPlaying.includes(d)
                        );

                        if (isAnyPaused) {
                          return (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                              ⏸ Paused
                            </span>
                          );
                        }

                        if (isAnyPlaying) {
                          return (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              ▶ Playing
                            </span>
                          );
                        }

                        return (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Active
                          </span>
                        );
                      })()}
                    </td>

                    {/* Actions */}
                    <td className="p-2 border">
                      <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2">
                        <Link
                          to={`/advertisements/${ad._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEye size={18} />
                        </Link>

                        <Link
                          to={`/advertisements/${ad._id}/edit`}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FaEdit size={18} />
                        </Link>

                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash size={18} />
                        </button>

                        {Array.isArray(ad.deviceId) &&
                          ad.deviceId.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  playAllInLocation(
                                    ad.company_ids?.[0]?._id,
                                    ad.location_ids?.[0]?._id,
                                    ad.deviceId
                                  )
                                }
                                className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 py-1 rounded text-xs"
                              >
                                ▶ Play
                              </button>

                              <button
                                onClick={() =>
                                  pauseAllInLocation(
                                    ad.company_ids?.[0]?._id,
                                    ad.location_ids?.[0]?._id,
                                    ad.deviceId
                                  )
                                }
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                              >
                                ⏸ Pause
                              </button>

                              <button
                                onClick={() =>
                                  stopAllInLocation(
                                    ad.company_ids?.[0]?._id,
                                    ad.location_ids?.[0]?._id,
                                    ad.deviceId
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-2 sm:px-3 py-1 rounded text-xs"
                              >
                                ⛔ Stop
                              </button>
                            </div>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <div className="flex justify-end items-center gap-2 mt-4">
            {Array.from({
              length: Math.ceil(sortedAds.length / itemsPerPage),
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded-md border text-sm transition ${page === i + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
