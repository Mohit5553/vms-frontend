import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { SOCKET_BASE_URL } from "../../config";

export default function AdScreen() {
  /* 🔥 NEW → GET TOKEN FROM URL */
  const { token } = useParams();

  const videoRef = useRef(null);
  const socketRef = useRef(null);

  // 🔥 IMPORTANT refs (avoid React re-render issues)
  const isPausedRef = useRef(false);
  const playerLoadedRef = useRef(false);
  const resumeTimeRef = useRef(0);

  const [DEVICE_ID, setDEVICE_ID] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ================= LOAD DEVICE FROM TOKEN ================= */

  useEffect(() => {
    if (!token) return;

    api
      .get(`/devices/by-token/${token}`)
      .then((res) => {
        const device = res.data.data;

        setDEVICE_ID(device.deviceId);

        // 🔥 If multiple locations, pick first
        if (device.location_id?.length) {
          setLocationId(device.location_id[0]._id);
        }
      })
      .catch(console.error);
  }, [token]);

  /* ================= REGISTER DEVICE ================= */

  useEffect(() => {
    if (!DEVICE_ID) return;

    api
      .post("/devices/register", {
        deviceId: DEVICE_ID,
        deviceName: `TV-${DEVICE_ID.slice(-4)}`,
      })
      .catch(console.error);
  }, [DEVICE_ID]);

  /* ================= SOCKET ================= */

  useEffect(() => {
    if (!DEVICE_ID) return;

    const socket = io(SOCKET_BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      if (DEVICE_ID) {
        socket.emit("register_device", {
          deviceId: DEVICE_ID,
          locationId: locationId || null,
        });
      }

    });

    /* ===== PLAY ===== */
    socket.on("play_ads", ({ ads, deviceId }) => {
      if (deviceId !== DEVICE_ID) return;

      console.log("PLAY event");

      // 🔥 Resume logic
      if (isPausedRef.current) {
        isPausedRef.current = false;

        if (videoRef.current) {
          videoRef.current.currentTime = resumeTimeRef.current;
          videoRef.current.play().catch(console.error);
        }

        if (socketRef.current && ads?.length) {
          socketRef.current.emit("playing_video", {
            deviceId: DEVICE_ID,
            videoPath:
              ads[currentIndex]?.videoPath || ads[0].videoPath,
          });
        }

        return;
      }

      if (playerLoadedRef.current) return;

      playerLoadedRef.current = true;

      setPlaylist(ads);
      setCurrentIndex(0);
    });

    /* ===== PAUSE ===== */
    socket.on("pause_ads", () => {
      if (videoRef.current) {
        resumeTimeRef.current =
          videoRef.current.currentTime;
        videoRef.current.pause();
      }

      isPausedRef.current = true;

      socketRef.current.emit("playing_video", {
        deviceId: DEVICE_ID,
        videoPath: "PAUSED",
      });
    });

    /* ===== STOP ===== */
    socket.on("stop_ads", () => {
      playerLoadedRef.current = false;
      isPausedRef.current = false;
      resumeTimeRef.current = 0;

      setPlaylist([]);
      setCurrentIndex(0);

      socketRef.current.emit("playing_video", {
        deviceId: DEVICE_ID,
        videoPath: null,
      });
    });

    return () => socket.disconnect();
  }, [DEVICE_ID, locationId]);

  /* ================= VIDEO LOAD ================= */

  useEffect(() => {
    if (!playlist.length || !videoRef.current) return;

    const currentAd = playlist[currentIndex];
    const videoUrl =
      `${SOCKET_BASE_URL}${currentAd.videoPath}`;

    if (videoRef.current.src !== videoUrl) {
      videoRef.current.src = videoUrl;
    }

    videoRef.current.muted = true;
    videoRef.current.play().catch(console.error);

    socketRef.current?.emit("playing_video", {
      deviceId: DEVICE_ID,
      videoPath: currentAd.videoPath,
    });
  }, [playlist, currentIndex, DEVICE_ID]);

  /* ================= UI ================= */

  return (
    <div className="w-screen h-screen bg-black relative">
      {playlist.length ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            muted
            playsInline
            loop
          />

          {/* 🔥 ticker */}
          <div className="absolute bottom-4 left-0 w-full bg-black/50 py-2 overflow-hidden">
            <div className="ticker text-white text-lg font-semibold">
              {playlist[currentIndex]?.title ||
                "Welcome to JTS Digital Signage"}
            </div>
          </div>

          <style>
            {`
              .ticker {
                white-space: nowrap;
                display: inline-block;
                padding-left: 100%;
                animation: tickerMove 15s linear infinite;
              }

              @keyframes tickerMove {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-100%); }
              }
            `}
          </style>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-white text-xl">
          Waiting for advertisement…
        </div>
      )}
    </div>
  );
}
