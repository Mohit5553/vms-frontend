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
  const audioUnlockedRef = useRef(false);
  const [DEVICE_ID, setDEVICE_ID] = useState(null);
  const [locationId, setLocationId] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ================= LOAD DEVICE FROM TOKEN ================= */
  // useEffect(() => {
  //   const enterFullscreen = () => {
  //     const elem = document.documentElement;

  //     if (elem.requestFullscreen) {
  //       elem.requestFullscreen().catch(() => {
  //         console.log("Fullscreen blocked");
  //       });
  //     }
  //     document.body.addEventListener("keydown", () => {
  //       if (videoRef.current) {
  //         videoRef.current.muted = false;
  //       }
  //     });
  //   };

  //   enterFullscreen();
  // }, []);


  useEffect(() => {
    const enterFullscreen = () => {
      const elem = document.documentElement;

      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => { });
      }

      // 🔥 unlock audio also
      if (videoRef.current) {
        videoRef.current.muted = false;
      }

      // remove after first use
      document.removeEventListener("click", enterFullscreen);
      document.removeEventListener("keydown", enterFullscreen);
      document.removeEventListener("touchstart", enterFullscreen);
    };

    document.addEventListener("click", enterFullscreen);
    document.addEventListener("keydown", enterFullscreen);
    document.addEventListener("touchstart", enterFullscreen);

    return () => {
      document.removeEventListener("click", enterFullscreen);
      document.removeEventListener("keydown", enterFullscreen);
      document.removeEventListener("touchstart", enterFullscreen);
    };
  }, []);
  useEffect(() => {
    const unlockAudio = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
      }
      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        videoRef.current &&
        !isPausedRef.current // 🔥 important
      ) {
        videoRef.current.play().catch(() => { });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (!token) return;

    api.get(`/devices/by-token/${token}`)
      .then((res) => {
        const device = res.data.data;

        // ✅ Generate stable custom device ID
        setDEVICE_ID(device.deviceId);

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
          const video = videoRef.current;

          video.currentTime = resumeTimeRef.current;

          // 🔥 Do NOT call safePlay again
          video.play().catch(() => { });
        }

        if (socketRef.current && ads?.length) {
          socketRef.current.emit("playing_video", {
            deviceId: DEVICE_ID,
            videoPath: ads[currentIndex]?.videoPath || ads[0].videoPath,
            currentTime: resumeTimeRef.current, // 🔥 MUST
          });
        }

        return;
      }

      // playerLoadedRef.current = true;
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


  const safePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // 🔥 Unlock sound only first time
      if (!audioUnlockedRef.current) {
        audioUnlockedRef.current = true;

        video.muted = true;
        await video.play();

        setTimeout(() => {
          video.muted = false;
          video.volume = 1;
        }, 1500);
      } else {
        // 🔥 Resume without changing mute
        video.play().catch(() => { });
      }

    } catch (e) {
      console.log("Autoplay blocked:", e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        videoRef.current &&
        !videoRef.current.paused &&
        socketRef.current
      ) {
        socketRef.current.emit("playing_video", {
          deviceId: DEVICE_ID,
          videoPath: playlist[currentIndex]?.videoPath,
          currentTime: videoRef.current.currentTime, // 🔥 IMPORTANT
        });
      }
    }, 1000); // every 1 second

    return () => clearInterval(interval);
  }, [DEVICE_ID, playlist, currentIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const preventAutoPlay = () => {
      if (isPausedRef.current) {
        video.pause();
      }
    };

    video.addEventListener("play", preventAutoPlay);

    return () => {
      video.removeEventListener("play", preventAutoPlay);
    };
  }, []);
  /* ================= VIDEO LOAD ================= */
  useEffect(() => {
    if (!playlist.length || !videoRef.current || !playlist[currentIndex]) return;

    const video = videoRef.current;
    const currentAd = playlist[currentIndex];
    const newSrc = `${SOCKET_BASE_URL}${currentAd.videoPath}`;

    if (!video.src || !video.src.endsWith(currentAd.videoPath)) {
      video.pause();
      video.removeAttribute("src");
      video.load();

      video.src = newSrc;
      video.currentTime = 0;

      // 🔥 IMPORTANT
      if (!isPausedRef.current) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => { });
        }
      }
    }

  }, [playlist, currentIndex, DEVICE_ID]);
  /* ================= UI ================= */
  // console.log(
  //   "VIDEO URL:",
  //   `${SOCKET_BASE_URL}${playlist[currentIndex]?.videoPath}`
  // );
  return (
    <div className="w-screen h-screen bg-black relative">
      {playlist.length ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop={playlist.length === 1}  // 🔥 loop only single video
            playsInline
            controls={false}
            disablePictureInPicture
            preload="auto"
            onEnded={() => {
              if (playlist.length > 1) {
                setCurrentIndex((prev) => (prev + 1) % playlist.length);
              }
            }}
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
