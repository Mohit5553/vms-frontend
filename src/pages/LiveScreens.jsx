import React, { useEffect, useState } from "react";
// import axios from "axios";
import api from "../api/axios";
import API_URL from "../../constantApi";

// const API_URL = "http://localhost:5000/api";

export default function LiveScreens() {
    const [screens, setScreens] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLiveScreens = async () => {
        try {
            // const res = await axios.get(`${API_URL}/admin/live-screens`);
            const res = await axios.get(`${API_URL}/admin/live-screens`);

            setScreens(res.data.data || []);
        } catch (err) {
            console.error("Live screens error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveScreens();

        // 🔥 Auto-refresh every 3 seconds so videos update in real time
        const interval = setInterval(fetchLiveScreens, 3000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="p-6">Loading live screens...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6">
                Live Screens ({screens.length})
            </h1>

            {screens.length === 0 ? (
                <p className="text-gray-500">No live screens currently.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {screens.map((screen) => {
                        const videoUrl = screen.currentVideo
                            ? `${API_URL}${screen.currentVideo}`
                            : null;
                        //  ? `http://localhost:5000${screen.currentVideo}`

                        return (
                            <div
                                key={screen.deviceId}
                                className="border rounded shadow bg-white p-3"
                            >
                                {videoUrl ? (
                                    <video
                                        src={videoUrl}
                                        className="w-full h-56 object-contain bg-black"
                                        controls
                                        muted
                                        autoPlay
                                        playsInline
                                    />
                                ) : (
                                    <div className="w-full h-56 bg-black flex items-center justify-center text-white">
                                        Video not started yet
                                    </div>
                                )}

                                <div className="mt-2 text-center">
                                    <p className="font-semibold">
                                        {screen.locationName || "Unknown Location"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Device: {screen.deviceId}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
