// import React, { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";
// import { useParams } from "react-router-dom";
// import axios from "axios";

// const socket = io("http://localhost:5000", {
//   transports: ["websocket"],
// });

// export default function AdScreen() {
//   const { locationId, deviceId: urlDeviceId } = useParams();
//   const videoRef = useRef(null);

//   const [DEVICE_ID, setDEVICE_ID] = useState(null);
//   const [playlist, setPlaylist] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // ===========================
//   // ✅ GET FINAL DEVICE ID (MANUAL + AUTO)
//   // ===========================
//   const getFinalDeviceId = async () => {
//     // 👉 CASE 1: MANUAL MODE (URL has deviceId)
//     if (urlDeviceId) {
//       return decodeURIComponent(urlDeviceId);
//     }

//     // 👉 CASE 2: ANDROID TV (REAL MAC)
//     if (window.Android && window.Android.getMacAddress) {
//       return window.Android.getMacAddress();
//     }

//     // 👉 CASE 3: AUTO MODE (STABLE ID STORED IN BROWSER)
//     let saved = localStorage.getItem("TV_DEVICE_ID");
//     if (saved) return saved;

//     const newId = "TV-" + Math.random().toString(36).substring(2, 10);
//     localStorage.setItem("TV_DEVICE_ID", newId);
//     return newId;
//   };

//   // ===========================
//   // ✅ INIT DEVICE ID
//   // ===========================
//   useEffect(() => {
//     const initDevice = async () => {
//       const id = await getFinalDeviceId();
//       setDEVICE_ID(id);
//       console.log("📺 Final Device ID:", id);
//     };

//     initDevice();
//   }, [urlDeviceId]);

//   // ===========================
//   // ✅ (OPTIONAL) AUTO-REGISTER DEVICE IN DB
//   // ===========================
//   useEffect(() => {
//     if (!DEVICE_ID) return;

//     axios
//       .post("http://localhost:5000/api/devices/register", {
//         deviceId: DEVICE_ID,
//         deviceName: `TV-${DEVICE_ID.slice(-4)}`,
//       })
//       .catch((err) =>
//         console.error("Device register failed (may already exist):", err)
//       );
//   }, [DEVICE_ID]);

//   // ===========================
//   // ✅ SOCKET LOGIC
//   // ===========================
//   useEffect(() => {
//     if (!DEVICE_ID) return;

//     const handleConnect = () => {
//       console.log("Connected device:", DEVICE_ID);

//       socket.emit("register_device", {
//         deviceId: DEVICE_ID,
//         locationId,
//         locationName: "Reception - Dubai Office",
//       });

//       // Join device-specific room (MATCHES YOUR BACKEND)
//       socket.emit("join_device", { deviceId: DEVICE_ID });

//       // Also join location room (keep your logic)
//       socket.emit("join_location_room", { locationId });
//     };

//     const handlePlayAds = ({ ads, deviceId }) => {
//       if (deviceId === DEVICE_ID) {
//         console.log("🎯 Playing ads for:", deviceId);
//         setPlaylist(ads);
//         setCurrentIndex(0);
//       }
//     };

//     const handleStopAds = () => {
//       console.log("🛑 Stop ads received");
//       setPlaylist([]);
//       setCurrentIndex(0);

//       if (videoRef.current) {
//         videoRef.current.pause();
//         videoRef.current.removeAttribute("src");
//         videoRef.current.load();
//       }
//     };

//     socket.on("connect", handleConnect);
//     socket.on("play_ads", handlePlayAds);
//     socket.on("stop_ads", handleStopAds);

//     return () => {
//       socket.off("connect", handleConnect);
//       socket.off("play_ads", handlePlayAds);
//       socket.off("stop_ads", handleStopAds);
//     };
//   }, [DEVICE_ID, locationId]);

//   // ===========================
//   // ✅ VIDEO PLAYER LOGIC
//   // ===========================
//   useEffect(() => {
//     if (!playlist.length || !videoRef.current || !DEVICE_ID) return;

//     const video = videoRef.current;
//     const currentAd = playlist[currentIndex];
//     const videoUrl = `http://localhost:5000${currentAd.videoPath}`;

//     if (video.src !== videoUrl) {
//       video.src = videoUrl;
//     }

//     const playAndNotify = async () => {
//       try {
//         await video.play();

//         socket.emit("playing_video", {
//           deviceId: DEVICE_ID,
//           videoPath: currentAd.videoPath,
//         });

//         console.log("📡 Playing:", currentAd.videoPath);
//       } catch (err) {
//         console.error("Play error:", err);
//       }
//     };

//     playAndNotify();
//   }, [currentIndex, playlist, DEVICE_ID]);

//   const handleEnded = () => {
//     if (!playlist.length) return;

//     setCurrentIndex((prev) => {
//       const nextIndex = prev + 1;
//       return nextIndex >= playlist.length ? 0 : nextIndex;
//     });
//   };


//   // ===========================
//   // ✅ UI (UNCHANGED)
//   // ===========================
//   return (
//     <div className="w-screen h-screen bg-black relative overflow-hidden">
//       {playlist.length ? (
//         <>
//           <video
//             key={currentIndex}
//             ref={videoRef}
//             className="w-full h-full object-contain"
//             autoPlay
//             playsInline
//             preload="auto"
//             loop={false}              // ✅ IMPORTANT
//             controls
//             onEnded={handleEnded}
//           />


//           <div className="absolute bottom-4 left-0 w-full bg-black/50 py-1 overflow-hidden">
//             <div className="flex w-full">
//               <div className="flex animate-marquee">
//                 <span className="whitespace-nowrap px-10 text-white text-lg font-semibold">
//                   {playlist[currentIndex]?.title ||
//                     "Advertisement Playing..."} •
//                 </span>
//                 <span className="whitespace-nowrap px-10 text-white text-lg font-semibold">
//                   {playlist[currentIndex]?.title ||
//                     "Advertisement Playing..."}
//                 </span>
//               </div>

//               <div className="flex animate-marquee">
//                 <span className="whitespace-nowrap px-10 text-white text-lg font-semibold">
//                   {playlist[currentIndex]?.title ||
//                     "Advertisement Playing..."}
//                 </span>
//                 <span className="whitespace-nowrap px-10 text-white text-lg font-semibold">
//                   {playlist[currentIndex]?.title ||
//                     "Advertisement Playing..."}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <style>
//             {`
//   @keyframes marquee {
//     0% { transform: translateX(0); }
//     100% { transform: translateX(-50%); }
//   }
//   .animate-marquee {
//     display: flex;
//     width: max-content;
//     animation: marquee 8s linear infinite;
//   }
// `}
//           </style>
//         </>
//       ) : (
//         <div className="w-screen h-screen flex items-center justify-center text-white text-center">
//           <div>
//             <h1 className="text-2xl font-bold">
//               Multi-Location Video Management System
//             </h1>
//             <p>Waiting for advertisement…</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
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
