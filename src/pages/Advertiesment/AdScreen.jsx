
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { SOCKET_BASE_URL } from "../../config";

const socket = io(SOCKET_BASE_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default function AdScreen() {
  const { locationId, deviceId: urlDeviceId } = useParams();
  const videoRef = useRef(null);

  const [DEVICE_ID, setDEVICE_ID] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getFinalDeviceId = async () => {
    if (urlDeviceId) return decodeURIComponent(urlDeviceId);

    let saved = localStorage.getItem("TV_DEVICE_ID");
    if (saved) return saved;

    const newId = "TV-" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("TV_DEVICE_ID", newId);
    return newId;
  };

  useEffect(() => {
    const init = async () => {
      const id = await getFinalDeviceId();
      setDEVICE_ID(id);
    };
    init();
  }, [urlDeviceId]);

  // Register device
  useEffect(() => {
    if (!DEVICE_ID) return;

    api.post("/devices/register", {
      deviceId: DEVICE_ID,
      deviceName: `TV-${DEVICE_ID.slice(-4)}`,
    }).catch(console.error);
  }, [DEVICE_ID]);

  // Socket logic
  useEffect(() => {
    if (!DEVICE_ID) return;

    socket.emit("register_device", {
      deviceId: DEVICE_ID,
      locationId,
    });

    socket.emit("join_device", { deviceId: DEVICE_ID });
    socket.emit("join_location_room", { locationId });

    socket.on("play_ads", ({ ads, deviceId }) => {
      if (deviceId === DEVICE_ID) {
        setPlaylist(ads);
        setCurrentIndex(0);
      }
    });

    socket.on("stop_ads", () => {
      setPlaylist([]);
      setCurrentIndex(0);
    });

    return () => {
      socket.off("play_ads");
      socket.off("stop_ads");
    };
  }, [DEVICE_ID, locationId]);

  // Video play logic
  useEffect(() => {
    if (!playlist.length || !videoRef.current) return;

    const currentAd = playlist[currentIndex];
    const videoUrl = `${SOCKET_BASE_URL}${currentAd.videoPath}`;

    videoRef.current.src = videoUrl;
    videoRef.current.play().catch(console.error);
  }, [currentIndex, playlist]);

  const handleEnded = () => {
    setCurrentIndex((prev) =>
      prev + 1 >= playlist.length ? 0 : prev + 1
    );
  };

  return (
    <div className="w-screen h-screen bg-black">
      {playlist.length ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          autoPlay
          controls
          onEnded={handleEnded}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-white">
          Waiting for advertisement…
        </div>
      )}
    </div>
  );
}
