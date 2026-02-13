import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { createSocket } from "../socket";
import { SOCKET_BASE_URL } from "../config";

export default function VideoMaster() {
  const [videos, setVideos] = useState([]);
  const socketRef = useRef(null);

  /* ================= SOCKET ================= */

  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Admin connected:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* ================= FETCH VIDEOS ================= */

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await api.get("/videos");
      setVideos(res.data.data || res.data);
    } catch (err) {
      console.error("Fetch videos error:", err);
    }
  };

  /* ================= PLAY & STOP ================= */

  const playAd = (video) => {
    if (!socketRef.current) return;

    socketRef.current.emit("play-ad", {
      deviceId: video.deviceId,
      videoUrl: `${SOCKET_BASE_URL}${video.videoUrl}`,
    });
  };

  const stopAd = (video) => {
    if (!socketRef.current) return;

    socketRef.current.emit("stop-ad", video.deviceId);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Video Master</h1>

      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th>Company</th>
            <th>Location</th>
            <th>Device</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {videos.map((v) => (
            <tr key={v._id}>
              <td>{v.company}</td>
              <td>{v.location}</td>
              <td>{v.deviceId}</td>
              <td>{v.title}</td>
              <td>
                <button
                  onClick={() => playAd(v)}
                  className="mr-2 bg-green-600 text-white px-3 py-1 rounded"
                >
                  ▶ Play
                </button>

                <button
                  onClick={() => stopAd(v)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  ⏹ Stop
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
