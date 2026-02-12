import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getCompanies } from "../services/company.api";
import { getLocationsByCompany } from "../services/location.api";
import axios from "axios";

const AddDevice = () => {
    const navigate = useNavigate();
    const location = useLocation();      // ✅ READ WHERE USER CAME FROM
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // 👉 THIS IS THE KEY LINE (REMEMBER WHERE TO GO BACK)
    const returnTo = location.state?.returnTo || "/devices";

    const [companies, setCompanies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        deviceId: "",
        deviceName: "",
        company_id: "",
        location_id: [],
        status: "active",
    });

    /* -------- Load Companies -------- */
    useEffect(() => {
        getCompanies().then((res) => setCompanies(res.data.data));
    }, []);

    /* -------- Load Locations when Company changes -------- */
    useEffect(() => {
        if (formData.company_id) {
            getLocationsByCompany(formData.company_id).then((res) =>
                setLocations(res.data.data)
            );
        } else {
            setLocations([]);
        }
    }, [formData.company_id]);

    /* -------- If EDIT MODE, fetch device details -------- */
    useEffect(() => {
        if (!isEditMode) return;

        setLoading(true);
        axios
            .get(`http://localhost:5000/api/devices/listbyid/${id}`)
            .then((res) => {
                const d = res.data.data;

                setFormData({
                    deviceId: d.deviceId,
                    deviceName: d.deviceName,
                    company_id: d.company_id._id,
                    location_id: d.location_id.map((l) => l._id),
                    status: d.status,
                });
            })
            .catch((err) => console.error("Failed to load device:", err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "company_id" && { location_id: [] }),
        }));
    };

    const selectedLocationNames = locations
        .filter((loc) => formData.location_id.includes(loc._id))
        .map((loc) => loc.name)
        .join(", ");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEditMode) {
                await axios.put(
                    `http://localhost:5000/api/devices/update/${id}`,
                    formData
                );
                alert("Device updated successfully");
            } else {
                await axios.post(
                    "http://localhost:5000/api/devices/create",
                    formData
                );
                alert("Device added successfully");
            }

            // ✅ FIXED NAVIGATION LOGIC
            navigate(returnTo);

        } catch (error) {
            alert(error?.response?.data?.message || "Something went wrong");
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading device data...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded mt-10">
            <h2 className="text-xl font-semibold mb-4">
                {isEditMode ? "Edit Device" : "Add New Device"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Device ID */}
                <div>
                    <label className="block mb-1 font-medium">Device ID</label>
                    <input
                        name="deviceId"
                        value={formData.deviceId}
                        onChange={handleChange}
                        required
                        disabled={isEditMode}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                {/* Device Name */}
                <div>
                    <label className="block mb-1 font-medium">Device Name</label>
                    <input
                        name="deviceName"
                        value={formData.deviceName}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="e.g. Front Desk Screen, Lobby TV, Gate Display"
                    />
                </div>

                {/* Company Dropdown */}
                <div>
                    <label className="block mb-1 font-medium">Company</label>
                    <select
                        name="company_id"
                        value={formData.company_id}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select Company</option>
                        {companies.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Location Multi Select */}
                <div className="relative">
                    <label className="block mb-1 font-medium">
                        Select Locations (Multiple)
                    </label>

                    <div
                        className="w-full border rounded px-3 py-2 cursor-pointer bg-white"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        {formData.location_id.length > 0
                            ? selectedLocationNames
                            : "Select locations..."}
                    </div>

                    {showDropdown && (
                        <div className="absolute left-0 right-0 bg-white border rounded mt-1 max-h-60 overflow-auto shadow z-10">
                            {locations.map((l) => {
                                const isChecked = formData.location_id.includes(l._id);

                                return (
                                    <label
                                        key={l._id}
                                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => {
                                                setFormData((prev) => {
                                                    const newLocations = isChecked
                                                        ? prev.location_id.filter((id) => id !== l._id)
                                                        : [...prev.location_id, l._id];

                                                    return { ...prev, location_id: newLocations };
                                                });
                                            }}
                                        />
                                        {l.name}
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label className="block mb-1 font-medium">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <button className="px-4 py-2 bg-blue-600 text-white rounded">
                    {isEditMode ? "Update Device" : "Save Device"}
                </button>
            </form>
        </div>
    );
};

export default AddDevice;
