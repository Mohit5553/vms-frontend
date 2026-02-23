import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const DeviceList = () => {
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const res = await api.get("/devices/list");
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
            await api.delete(`/devices/delete/${id}`);
            alert("Device deleted successfully");
            fetchDevices();
        } catch (error) {
            alert(error?.response?.data?.message || "Delete failed");
        }
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
        setPage(1);
    };

    /* 🔍 Search */
    const filteredDevices = useMemo(() => {
        return devices.filter((d) =>
            d.deviceName?.toLowerCase().includes(search.toLowerCase())
        );
    }, [devices, search]);

    /* 🔽 Sorting */
    const sortedDevices = useMemo(() => {
        if (!sortField) return filteredDevices;

        return [...filteredDevices].sort((a, b) => {
            const aVal = a[sortField] || "";
            const bVal = b[sortField] || "";

            return sortDirection === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [filteredDevices, sortField, sortDirection]);

    /* 📄 Pagination */
    const paginatedDevices = useMemo(() => {
        return sortedDevices.slice(
            (page - 1) * itemsPerPage,
            page * itemsPerPage
        );
    }, [sortedDevices, page]);

    /* Skeleton loading */
    if (loading) {
        return (
            <div className="p-6 space-y-3">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-12 bg-gray-200 rounded animate-pulse"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Header + Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold">Devices</h2>
                    <p className="text-gray-500 text-sm">
                        Manage and control your screen devices
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <input
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search devices..."
                        className="border px-3 py-2 rounded w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={() => navigate("/add-device")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        + Add Device
                    </button>
                </div>
            </div>

            {devices.length === 0 ? (
                <p className="text-gray-500">No devices found.</p>
            ) : (
                <>
                    {/* <div className="mb-2 text-sm text-gray-500">
                        Showing {paginatedDevices.length} of {sortedDevices.length} devices
                    </div> */}

                    <div className="overflow-x-auto rounded-lg border shadow-sm bg-white">
                        <table className="w-full min-w-[900px] border-collapse">
                            <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 border">#</th>

                                    <th
                                        onClick={() => handleSort("deviceId")}
                                        className="cursor-pointer p-3 border"
                                    >
                                        Device ID{" "}
                                        {sortField === "deviceId" &&
                                            (sortDirection === "asc" ? "↑" : "↓")}
                                    </th>

                                    <th
                                        onClick={() => handleSort("deviceName")}
                                        className="cursor-pointer p-3 border"
                                    >
                                        Device Name{" "}
                                        {sortField === "deviceName" &&
                                            (sortDirection === "asc" ? "↑" : "↓")}
                                    </th>

                                    <th className="p-3 border">Company</th>
                                    <th className="p-3 border">Location</th>
                                    <th className="p-3 border">Status</th>
                                    <th className="p-3 border text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedDevices.map((d, i) => (
                                    <tr key={d._id} className="hover:bg-blue-50">
                                        <td className="p-2 border">
                                            {(page - 1) * itemsPerPage + i + 1}
                                        </td>

                                        <td className="p-2 border font-medium">{d.deviceId}</td>
                                        <td className="p-2 border">{d.deviceName || "—"}</td>
                                        <td className="p-2 border">
                                            {d.company_id?.name || "—"}
                                        </td>

                                        <td className="p-2 border">
                                            {Array.isArray(d.location_id) &&
                                                d.location_id.length > 0
                                                ? d.location_id.map((loc) => loc.name).join(", ")
                                                : "—"}
                                        </td>

                                        <td className="p-2 border">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {d.status}
                                            </span>
                                        </td>

                                        <td className="p-2 border">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/edit-device/${d._id}`)}
                                                    className="text-yellow-600"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(d._id)}
                                                    className="text-red-600"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-end items-center gap-2 mt-4">
                        {Array.from({
                            length: Math.ceil(sortedDevices.length / itemsPerPage),
                        }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-3 py-1 rounded-md border text-sm ${page === i + 1
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DeviceList;