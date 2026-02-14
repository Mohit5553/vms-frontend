import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "../config";

export default function DevicePlayer({ deviceId }) {
  const videoRef = useRef(null);
  const socketRef = useRef(null);

  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!deviceId) return;

    const socket = io(SOCKET_BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Device connected:", socket.id);

      socket.emit("register_device", { deviceId });
    });

    socket.on("play_ads", ({ ads }) => {
      console.log("Received ads:", ads);
      setPlaylist(ads);
      setCurrentIndex(0);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect(); // ✅ cleanup
    };
  }, [deviceId]);

  /* ================= VIDEO ================= */

  useEffect(() => {
    if (!playlist.length || !videoRef.current) return;

    const videoUrl =
      `${SOCKET_BASE_URL}${playlist[currentIndex].videoPath}`;

    videoRef.current.src = videoUrl;

    videoRef.current.play().catch((err) => {
      console.error("Autoplay error:", err);
    });
  }, [playlist, currentIndex]);

  const handleEnded = () => {
    setCurrentIndex((prev) =>
      prev + 1 >= playlist.length ? 0 : prev + 1
    );
  };

  /* ================= UI ================= */

  if (!playlist.length) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Waiting for ads...
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      controls={false}
      onEnded={handleEnded}
      className="w-full h-screen object-contain"
    />
  );
}
