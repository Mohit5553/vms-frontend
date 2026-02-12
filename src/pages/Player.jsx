import { socket } from "./socket";
import { useEffect, useRef } from "react";

const DEVICE_ID = "STORE_001";

export default function Player() {
  const videoRef = useRef();

  useEffect(() => {
    socket.emit("register-device", DEVICE_ID);

    socket.on("play-video", (url) => {
      videoRef.current.src = url;
      videoRef.current.play();
    });

    socket.on("stop-video", () => {
      videoRef.current.pause();
    });
  }, []);

  return <video ref={videoRef} autoPlay controls />;
}
