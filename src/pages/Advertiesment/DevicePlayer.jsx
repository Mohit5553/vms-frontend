import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "../config";

const socket = io(SOCKET_BASE_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

export default function DevicePlayer({ deviceId }) {
  const videoRef = useRef();
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    socket.emit("register_device", { deviceId });

    socket.on("play_ads", ({ ads }) => {
      setPlaylist(ads);
      setCurrentIndex(0);
    });

    return () => {
      socket.off("play_ads");
    };
  }, [deviceId]);

  const handleEnded = () => {
    if (currentIndex + 1 < playlist.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!playlist.length) {
    return <h2>Waiting for ads...</h2>;
  }

  return (
    <video
      ref={videoRef}
      src={`${SOCKET_BASE_URL}${playlist[currentIndex].videoPath}`}
      autoPlay
      controls={false}
      onEnded={handleEnded}
      className="w-full h-screen"
    />
  );
}
