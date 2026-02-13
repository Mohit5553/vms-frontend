import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { socket } from "../socket";
import { SOCKET_BASE_URL } from "../config";

export default function VideoMaster() {
  const [videos, setVideos] = useState([]);

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

  const playAd = (video) => {
    socket.emit("play-ad", {
      deviceId: video.deviceId,
      videoUrl: `${SOCKET_BASE_URL}${video.videoUrl}`,
    });
  };

  const stopAd = (video) => {
    socket.emit("stop-ad", video.deviceId);
  };

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
                <button onClick={() => playAd(v)}>▶ Play</button>
                <button onClick={() => stopAd(v)}>⏹ Stop</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
