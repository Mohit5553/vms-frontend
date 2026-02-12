import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

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

    return () => socket.off("play_ads");
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
      src={`http://localhost:5000/${playlist[currentIndex].videoPath}`}
      autoPlay
      controls={false}
      onEnded={handleEnded}
      className="w-full h-screen"
    />
  );
}
