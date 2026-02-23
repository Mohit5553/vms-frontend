import React, { useRef, useEffect, memo } from "react";

const StableVideo = memo(({ videoUrl, currentTime }) => {
    const videoRef = useRef(null);
    const lastUrlRef = useRef("");

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !videoUrl) return;

        // 🔥 Change source only when video changes
        if (lastUrlRef.current !== videoUrl) {
            video.src = videoUrl;
            lastUrlRef.current = videoUrl;
        }

        // 🔥 Sync time only if drift
        if (
            currentTime &&
            Math.abs(video.currentTime - currentTime) > 1
        ) {
            video.currentTime = currentTime;
        }

        if (video.paused) {
            video.play().catch(() => { });
        }
    }, [videoUrl, currentTime]);

    return (
        <video
            ref={videoRef}
            muted
            autoPlay
            playsInline
            className="w-full h-56 object-contain bg-black"
        />
    );
});

export default StableVideo;