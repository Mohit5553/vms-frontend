import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeviceList = () => {
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_URL = "http://localhost:5000/api/devices";

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/list`);
            setDevices(res.data.data || []);
        } catch (error) {
            alert("Failed to load devices");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this device?")) return;

        try {
            await axios.delete(`${API_URL}/delete/${id}`); // ✅ Correct route
            alert("Device deleted successfully");
            fetchDevices();
        } catch (error) {
            alert(error?.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-8 p-6 bg-white shadow rounded">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Device List</h2>

                <button
                    onClick={() => navigate("/add-device")}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    + Add Device
                </button>
            </div>

            {loading ? (
                <p className="text-center">Loading devices...</p>
            ) : devices.length === 0 ? (
                <p className="text-center text-gray-500">No devices found</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">#</th>
                                <th className="border p-2">Device ID</th>
                                <th className="border p-2">Device Name</th>
                                <th className="border p-2">Company</th>
                                <th className="border p-2">Location</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {devices.map((d, i) => (
                                <tr key={d._id} className="text-center">
                                    <td className="border p-2">{i + 1}</td>
                                    <td className="border p-2 font-medium">{d.deviceId}</td>
                                    <td className="border p-2">{d.deviceName || "—"}</td>
                                    <td className="border p-2">
                                        {d.company_id?.name || "—"}
                                    </td>
                                    <td className="border p-2">
                                        {Array.isArray(d.location_id) && d.location_id.length > 0
                                            ? d.location_id.map((loc) => loc.name).join(", ")
                                            : "—"}
                                    </td>
                                    <td className="border p-2">
                                        <span
                                            className={`px-2 py-1 rounded text-white ${d.status === "active"
                                                ? "bg-green-600"
                                                : "bg-red-600"
                                                }`}
                                        >
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="border p-2 space-x-2">
                                        <button
                                            onClick={() => navigate(`/edit-device/${d._id}`)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => handleDelete(d._id)}
                                            className="px-3 py-1 bg-red-600 text-white rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DeviceList;
