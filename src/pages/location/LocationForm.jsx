import React, { useEffect, useState } from "react";
import { getCompanies } from "../services/company.api";
import { createLocation, updateLocation } from "../services/location.api";
import { useNavigate } from "react-router-dom";

const LocationForm = ({ initialData = null }) => {
  const isEditMode = Boolean(initialData?._id);
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_id: initialData?.company_id?._id || "",
    name: initialData?.name || "",
    street: initialData?.address?.street || "",
    city: initialData?.address?.city || "",
    state: initialData?.address?.state || "",
    country: initialData?.address?.country || "",
    postalCode: initialData?.address?.postalCode || "",
    contactPerson: initialData?.contactPerson || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
  });

  useEffect(() => {
    getCompanies().then((res) => setCompanies(res.data.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      company_id: formData.company_id,
      name: formData.name,
      contactPerson: formData.contactPerson,
      phone: formData.phone,
      email: formData.email,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
      },
    };

    try {
      if (isEditMode) {
        await updateLocation(initialData._id, payload);
        alert("Location updated");

        // ✅ redirect after update
        navigate("/locations");
      } else {
        await createLocation(payload);
        alert("Location created");

        // ✅ redirect after create
        navigate("/locations");
      }
    } catch (error) {
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-8 rounded shadow"
    >
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Location" : "Create Location"}
      </h2>

      {/* Company Dropdown */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Company <span className="text-red-500">*</span>
        </label>
        <select
          name="company_id"
          required
          value={formData.company_id}
          onChange={handleChange}
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

      {/* Location Name */}
      <Input
        label="Location Name"
        name="name"
        required
        value={formData.name}
        onChange={handleChange}
      />

      {/* Address */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Street"
          name="street"
          value={formData.street}
          onChange={handleChange}
        />
        <Input
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
        />
        <Input
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
        />
        <Input
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
        />
        <Input
          label="Postal Code"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
        />
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Input
          label="Contact Person"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
        />
        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Saving..." : "Save Location"}
        </button>
      </div>
    </form>
  );
};

const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block mb-1">{label}</label>
    <input {...props} className="w-full border rounded px-3 py-2" />
  </div>
);

export default LocationForm;
