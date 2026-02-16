import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/axios";
import { getCompanies } from "../services/company.api";
import { getLocationsByCompany } from "../services/location.api";
import {
  createAdvertisement,
  updateAdvertisement,
} from "../services/advertisement.api";
import { useNavigate, useLocation } from "react-router-dom";

const AdvertisementForm = ({ initialData = null }) => {
  const isEditMode = Boolean(initialData?._id);
  const navigate = useNavigate();
  const locationState = useLocation();

  const [companies, setCompanies] = useState([]);
  const [locations, setLocations] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  // COMPANY SEARCH
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  // LOCATION SEARCH
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const filteredLocations = locations.filter((l) =>
    l.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // === DEVICE STATES ===
  const [devices, setDevices] = useState([]);
  const [deviceSearch, setDeviceSearch] = useState("");
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);

  const [formData, setFormData] = useState({
    company_ids: initialData?.company_ids || [],
    location_ids: initialData?.location_ids || [],
    deviceIds: initialData?.deviceIds || [],
    title: initialData?.title || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate?.slice(0, 10) || "",
    endDate: initialData?.endDate?.slice(0, 10) || "",
    playOrder: initialData?.playOrder || 1,
  });


  /* ---------------- Load Companies ---------------- */
  useEffect(() => {
    getCompanies().then((res) => setCompanies(res.data.data));
  }, []);

  /* ---------------- Load Locations by Company ---------------- */
  useEffect(() => {
    if (!formData.company_ids.length) {
      setLocations([]);
      return;
    }

    Promise.all(
      formData.company_ids.map((id) => getLocationsByCompany(id))
    ).then((responses) => {
      const all = responses.flatMap((r) => r.data.data);
      setLocations(all);
    });
  }, [formData.company_ids]);

  /* ---------------- Load Devices by Location ---------------- */
  /* ---------------- Load Devices by Location ---------------- */
  useEffect(() => {
    if (!formData.location_ids?.length) {
      setDevices([]);
      return;
    }

    api
      .get("/devices/list")
      .then((res) => {
        const filtered = (res.data.data || []).filter((d) =>
          d.location_id?.some((loc) =>
            formData.location_ids.includes(loc._id)
          )
        );

        setDevices(filtered);
      })
      .catch((err) => console.error("Device fetch error:", err));
  }, [formData.location_ids]);   // ✅ correct dependency

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "company_id" && { location_id: "", deviceId: [] }),
      ...(name === "location_id" && { deviceId: [] }),
    }));
  };

  const filteredDevices = devices.filter((d) =>
    d.deviceId.toLowerCase().includes(deviceSearch.toLowerCase())
  );
  const toggleCompany = (id) => {
    setFormData(prev => {
      const exists = prev.company_ids.includes(id);
      return {
        ...prev,
        company_ids: exists
          ? prev.company_ids.filter(x => x !== id)
          : [...prev.company_ids, id],
        location_ids: [],
        deviceIds: [],
      };
    });

    setShowCompanyDropdown(false);
  };


  const toggleLocation = (id) => {
    setFormData((prev) => {
      const exists = prev.location_ids.includes(id);

      return {
        ...prev,
        location_ids: exists
          ? prev.location_ids.filter((x) => x !== id)
          : [...prev.location_ids, id],
        deviceIds: [],
      };
    });
  };

  const toggleDevice = (deviceId) => {
    setFormData((prev) => {
      const exists = prev.deviceIds.includes(deviceId);

      return {
        ...prev,
        deviceIds: exists
          ? prev.deviceIds.filter((x) => x !== deviceId)
          : [...prev.deviceIds, deviceId],
      };
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (["company_ids", "location_ids", "deviceIds"].includes(key)) {
        payload.append(key, JSON.stringify(value));
      } else {
        payload.append(key, value);
      }

    });

    if (videoFile) {
      payload.append("video", videoFile);
    }

    try {
      if (isEditMode) {
        await updateAdvertisement(initialData._id, payload);
        alert("Advertisement updated successfully");
      } else {
        await createAdvertisement(payload);
        alert("Advertisement created successfully");
      }

      navigate("/advertisements");
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    if (!showCompanyDropdown) setCompanySearch("");
  }, [showCompanyDropdown]);

  useEffect(() => {
    if (!showLocationDropdown) setLocationSearch("");
  }, [showLocationDropdown]);

  useEffect(() => {
    if (!showDeviceDropdown) setDeviceSearch("");
  }, [showDeviceDropdown]);

  return (
    <form
      className="max-w-4xl mx-auto bg-white p-8 shadow rounded"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Advertisement" : "Create Advertisement"}
      </h2>

      {/* Company */}
      {/* COMPANY MULTI SELECT */}
      <div className="mb-4 relative">
        <label className="block mb-1 font-medium">Select Companies</label>

        <div
          className="w-full border rounded px-3 py-2 cursor-pointer bg-white"
          onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
        >
          {formData.company_ids.length > 0
            ? companies
              .filter(c => formData.company_ids.includes(c._id))
              .map(c => c.name)
              .join(", ")

            : "Search and select companies..."}
        </div>

        {showCompanyDropdown && (
          <div className="absolute left-0 right-0 bg-white border rounded mt-1 max-h-60 overflow-auto shadow z-10 p-2">

            <input
              type="text"
              placeholder="Search company..."
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              className="w-full border rounded px-2 py-1 mb-2"
            />

            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((c) => {
                const checked = formData.company_ids.includes(c._id);

                return (
                  <label
                    key={c._id}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCompany(c._id)}
                    />
                    {c.name}
                  </label>
                );
              })
            ) : (
              <div className="text-center py-2">
                <p className="text-gray-500">No company found</p>

                <button
                  type="button"
                  onClick={() => navigate("/companies/new")}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
                >
                  + Add Company
                </button>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Location */}
      {/* LOCATION MULTI SELECT */}
      <div className="mb-4 relative">
        <label className="block mb-1 font-medium">Select Locations</label>

        <div
          className="w-full border rounded px-3 py-2 cursor-pointer bg-white"
          onClick={() => setShowLocationDropdown(!showLocationDropdown)}
        >
          {formData.location_ids.length > 0
            ? locations
              .filter(l => formData.location_ids.includes(l._id))
              .map(l => l.name)
              .join(", ")

            : "Search and select locations..."}
        </div>

        {showLocationDropdown && (
          <div className="absolute left-0 right-0 bg-white border rounded mt-1 max-h-60 overflow-auto shadow z-10 p-2">

            <input
              type="text"
              placeholder="Search location..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full border rounded px-2 py-1 mb-2"
            />

            {filteredLocations.length > 0 ? (
              filteredLocations.map((l) => {
                const checked = formData.location_ids.includes(l._id);

                return (
                  <label
                    key={l._id}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleLocation(l._id)}
                    />
                    {l.name}
                  </label>
                );
              })
            ) : (
              <div className="text-center py-2">
                <p className="text-gray-500">No location found</p>

                <button
                  type="button"
                  onClick={() => navigate("/locations/new")}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
                >
                  + Add Location
                </button>
              </div>
            )}
          </div>
        )}
      </div>


      {/* DEVICE MULTI SELECT WITH SEARCH */}
      <div className="mb-4 relative">
        <label className="block mb-1 font-medium">Select Devices</label>

        <div
          className="w-full border rounded px-3 py-2 cursor-pointer bg-white"
          onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
        >
          {formData.deviceIds.length > 0
            ? formData.deviceIds.join(", ")
            : "Search and select devices..."}

        </div>

        {showDeviceDropdown && (
          <div className="absolute left-0 right-0 bg-white border rounded mt-1 max-h-60 overflow-auto shadow z-10 p-2">
            <input
              type="text"
              placeholder="Search device..."
              value={deviceSearch}
              onChange={(e) => setDeviceSearch(e.target.value)}
              className="w-full border rounded px-2 py-1 mb-2"
            />

            {filteredDevices.length > 0 ? (
              filteredDevices.map((d) => {
                const isChecked = formData.deviceIds.includes(d.deviceId);

                return (
                  <label
                    key={d._id}
                    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDevice(d.deviceId)}
                    />
                    {d.deviceId} — {d.deviceName}
                  </label>
                );
              })
            ) : (
              <div className="text-center py-2">
                <p className="text-gray-500">No device found</p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/add-device", {
                      state: { returnTo: window.location.pathname },
                    })
                  }
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
                >
                  + Add Device
                </button>
              </div>
            )}
          </div>
        )}

        {/* <p className="text-sm text-gray-500 mt-1">
          Click to search and select multiple devices
        </p> */}
      </div>

      <Input
        label="Video Title"
        name="title"
        required
        value={formData.title}
        onChange={handleChange}
      />

      {/* Video Upload */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Upload Video {isEditMode ? "(optional)" : "*"}
        </label>
        <input
          type="file"
          accept="video/*"
          required={!isEditMode}
          onChange={(e) => setVideoFile(e.target.files[0])}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <Input
        label="Play Order"
        name="playOrder"
        type="number"
        value={formData.playOrder}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Start Date"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
        />
        <Input
          label="End Date"
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
        />
      </div>

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <div className="flex justify-end mt-6">
        <button className="px-6 py-2 bg-blue-600 text-white rounded">
          Save Advertisement
        </button>
      </div>
    </form>
  );
};

/* ---------------- Reusable UI Components ---------------- */

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium">{label}</label>
    <input
      {...props}
      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium">{label}</label>
    <textarea
      {...props}
      rows="3"
      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="mb-4">
    <label className="block mb-1 font-medium">{label}</label>
    <select
      {...props}
      className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select {label}</option>
      {options.map((o) => (
        <option key={o._id} value={o._id}>
          {o.name}
        </option>
      ))}
    </select>
  </div>
);

export default AdvertisementForm;
