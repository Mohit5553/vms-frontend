import { useEffect, useRef } from "react";
import { createSocket } from "./socket";

const DEVICE_ID = "STORE_001";

export default function Player() {
  const videoRef = useRef(null);
  const socketRef = useRef(null);

  /* ================= SOCKET ================= */

  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Player connected:", socket.id);

      socket.emit("register-device", DEVICE_ID);
    });

    socket.on("play-video", (url) => {
      if (!videoRef.current) return;

      videoRef.current.src = url;
      videoRef.current.play().catch((err) => {
        console.error("Autoplay error:", err);
      });
    });

    socket.on("stop-video", () => {
      if (!videoRef.current) return;
      videoRef.current.pause();
    });

    return () => {
      socket.disconnect(); // ✅ cleanup
    };
  }, []);

  /* ================= UI ================= */

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      controls
      className="w-full h-screen"
    />
  );
}
