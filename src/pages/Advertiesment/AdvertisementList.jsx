import React, { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  getAdvertisement,
  deleteAdvertisement,
} from "../services/advertisement.api";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function AdvertisementList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState([]); // array of DEVICE IDs (MAC)
  const [deviceMap, setDeviceMap] = useState({});

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await getAdvertisement();
      setAds(res.data.data || []);
      // 🔥 Fetch all devices and create MAC → Name map

      // Load saved playing locations from sessionStorage
      const saved = sessionStorage.getItem("playingDevices");
      if (saved) setIsPlaying(JSON.parse(saved));
      const deviceRes = await axios.get("http://localhost:5000/api/devices/list");

      const map = {};
      (deviceRes.data.data || []).forEach((d) => {
        map[d.deviceId] = d.deviceName; // 🔥 KEY FIX
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

  const handleDelete = async (id) => {
    if (!window.confirm("Deactivate this advertisement?")) return;
    await deleteAdvertisement(id);
    fetchAds();
  };
  const isLocationPlaying = (deviceIds = []) =>
    Array.isArray(deviceIds) &&
    deviceIds.length > 0 &&
    deviceIds.every((id) => isPlaying.includes(id));

  // const playAds = async (companyId, locationId, deviceId) => {
  //   try {
  //     await axios.post(`${API_URL}/advertisement/play`, {
  //       companyId,
  //       locationId,
  //       deviceId,   // 🔥 NEW
  //     });

  //     setIsPlaying((prev) => {
  //       const updated = prev.includes(deviceId)
  //         ? prev
  //         : [...prev, deviceId];

  //       sessionStorage.setItem(
  //         "playingDevices",
  //         JSON.stringify(updated)
  //       );
  //       return updated;
  //     });
  //   } catch (error) {
  //     console.error("Play API Error:", error);
  //     alert("Play failed — check console");
  //   }
  // };


  // const stopAds = async (companyId, locationId, deviceId) => {
  //   try {
  //     await axios.post(`${API_URL}/advertisement/stop`, {
  //       companyId,
  //       deviceId,   // ✅ MUST SEND THIS
  //     });

  //     setIsPlaying((prev) => {
  //       const updated = prev.filter((id) => id !== deviceId);
  //       sessionStorage.setItem(
  //         "playingDevices",   // ✅ KEEP SAME KEY
  //         JSON.stringify(updated)
  //       );
  //       return updated;
  //     });
  //   } catch (error) {
  //     console.error("Stop API Error:", error);
  //     alert("Stop failed — check console");
  //   }
  // };

  const playAllInLocation = async (companyId, locationId, deviceIds = []) => {
    try {
      // ✅ Use your EXISTING route: /advertisement/play
      for (const deviceId of deviceIds) {
        await axios.post(`${API_URL}/advertisement/play`, {
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
    } catch (error) {
      console.error("Play All Error:", error);
      alert("Play All failed — check console");
    }
  };
  const stopAllInLocation = async (companyId, locationId, deviceIds = []) => {
    try {
      // ✅ Use your EXISTING route: /advertisement/stop
      for (const deviceId of deviceIds) {
        await axios.post(`${API_URL}/advertisement/stop`, {
          companyId,
          deviceId,
        });
      }

      setIsPlaying((prev) => {
        const updated = prev.filter((id) => !deviceIds.includes(id));
        sessionStorage.setItem("playingDevices", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Stop All Error:", error);
      alert("Stop All failed — check console");
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-full">
        <p>Loading advertisements...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-full">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Advertisements</h2>
        <Link
          to="/advertisements/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Advertisement
        </Link>
      </div>

      {ads.length === 0 ? (
        <p className="text-gray-600">No advertisements found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Screen URL</th>
              <th className="p-2 border">Devices</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id}>
                <td className="p-2 border">{ad.title}</td>
                <td className="p-2 border">
                  {ad.company_id?.name || "-"}
                </td>
                <td className="p-2 border">
                  {ad.location_id?.name || "-"}
                </td>

                <td className="p-2 border">
                  <div className="flex flex-col gap-1">
                    {/* 🔥 AUTO MODE LINK */}
                    <a
                      href={`/screen/${ad.location_id?._id}`}
                      target="_blank"
                      className="text-blue-600 hover:underline text-sm font-semibold"
                    >
                      /screen/{ad.location_id?._id}  (Auto Screen)
                    </a>

                    {/* 🔹 MANUAL MODE LINKS (your existing ones) */}
                    {Array.isArray(ad.deviceId) && ad.deviceId.length > 0 &&
                      ad.deviceId.map((mac) => (
                        <a
                          key={mac}
                          href={`/screen/${ad.location_id?._id}/${encodeURIComponent(mac)}`}
                          target="_blank"
                          className="text-purple-600 hover:underline text-sm"
                        >
                          /screen/{ad.location_id?._id}/{mac}
                        </a>
                      ))
                    }
                  </div>
                </td>



                {/* ✅ FIXED: Show multiple devices properly */}
                <td className="p-2 border">
                  {Array.isArray(ad.deviceId) && ad.deviceId.length > 0
                    ? ad.deviceId
                      .map((mac) => deviceMap[mac] || mac) // 👈 convert MAC → Name
                      .join(", ")
                    : "-"}
                </td>


                {/* STATUS */}
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-sm ${Array.isArray(ad.deviceId) &&
                      ad.deviceId.some(d => isPlaying.includes(d))
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                      }`}
                  >
                    {Array.isArray(ad.deviceId) &&
                      ad.deviceId.some(d => isPlaying.includes(d))
                      ? "Playing"
                      : "Active"}
                  </span>
                </td>


                <td className="p-6 border">
                  <div className="flex items-center justify-center gap-3">
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

                    {/* 🔥 SINGLE TOGGLE BUTTON (Play All / Stop All) */}
                    {Array.isArray(ad.deviceId) && ad.deviceId.length > 0 && (
                      <div className="mb-2">
                        {isLocationPlaying(ad.deviceId) ? (
                          <button
                            onClick={() =>
                              stopAllInLocation(
                                ad.company_id?._id,
                                ad.location_id?._id,
                                ad.deviceId
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            ⛔ Stop All
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              playAllInLocation(
                                ad.company_id?._id,
                                ad.location_id?._id,
                                ad.deviceId
                              )
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            ▶ Play All
                          </button>
                        )}
                      </div>
                    )}


                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
