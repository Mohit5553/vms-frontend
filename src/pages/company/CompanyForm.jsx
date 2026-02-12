import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanyForm = ({ initialData = null }) => {
  const isEditMode = Boolean(initialData?._id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    industry: initialData?.industry || "",
    foundedYear: initialData?.foundedYear || "",
    companySize: initialData?.companySize || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    website: initialData?.website || "",
    gstNumber: initialData?.gstNumber || "",
    panNumber: initialData?.panNumber || "",
    cinNumber: initialData?.cinNumber || "",
    registrationNumber: initialData?.registrationNumber || "",
    address: {
      street: initialData?.address?.street || "",
      city: initialData?.address?.city || "",
      state: initialData?.address?.state || "",
      country: initialData?.address?.country || "",
      postalCode: initialData?.address?.postalCode || "",
    },
    bankDetails: {
      bankName: initialData?.bankDetails?.bankName || "",
      accountNumber: initialData?.bankDetails?.accountNumber || "",
      ifscCode: initialData?.bankDetails?.ifscCode || "",
    },
    notes: initialData?.notes || "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:5000/api/company/edit/${initialData._id}`,
          formData,
        );
        setSuccessMsg("Company updated successfully");

        // ✅ redirect after update
        navigate("/companies");
      } else {
        await axios.post("http://localhost:5000/api/company/create", formData);
        setSuccessMsg("Company created successfully");

        // ✅ redirect after create
        navigate("/companies");
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow"
    >
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Company" : "Create Company"}
      </h2>

      {/* Alerts */}
      {successMsg && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Basic Info */}
      <Section title="Basic Details">
        <Input
          label="Company Name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
        />
        <Input
          label="Founded Year"
          name="foundedYear"
          type="number"
          value={formData.foundedYear}
          onChange={handleChange}
        />
        <Input
          label="Company Size"
          name="companySize"
          value={formData.companySize}
          onChange={handleChange}
        />
        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </Section>

      {/* Contact */}
      <Section title="Contact Details">
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          label="Website"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </Section>

      {/* Address */}
      <Section title="Address">
        <Input
          label="Street"
          name="address.street"
          value={formData.address.street}
          onChange={handleChange}
        />
        <Input
          label="City"
          name="address.city"
          value={formData.address.city}
          onChange={handleChange}
        />
        <Input
          label="State"
          name="address.state"
          value={formData.address.state}
          onChange={handleChange}
        />
        <Input
          label="Country"
          name="address.country"
          value={formData.address.country}
          onChange={handleChange}
        />
        <Input
          label="Postal Code"
          name="address.postalCode"
          value={formData.address.postalCode}
          onChange={handleChange}
        />
      </Section>

      {/* Compliance */}
      <Section title="Business & Tax Information">
        <Input
          label="GST Number"
          name="gstNumber"
          value={formData.gstNumber}
          onChange={handleChange}
        />
        <Input
          label="PAN Number"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleChange}
        />
        <Input
          label="CIN Number"
          name="cinNumber"
          value={formData.cinNumber}
          onChange={handleChange}
        />
        <Input
          label="Registration Number"
          name="registrationNumber"
          value={formData.registrationNumber}
          onChange={handleChange}
        />
      </Section>

      {/* Bank */}
      <Section title="Bank Details">
        <Input
          label="Bank Name"
          name="bankDetails.bankName"
          value={formData.bankDetails.bankName}
          onChange={handleChange}
        />
        <Input
          label="Account Number"
          name="bankDetails.accountNumber"
          value={formData.bankDetails.accountNumber}
          onChange={handleChange}
        />
        <Input
          label="IFSC Code"
          name="bankDetails.ifscCode"
          value={formData.bankDetails.ifscCode}
          onChange={handleChange}
        />
      </Section>

      {/* Notes */}
      <Section title="Additional Notes">
        <Textarea
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </Section>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60"
        >
          {loading && <Spinner />}
          {loading
            ? "Saving..."
            : isEditMode
              ? "Update Company"
              : "Create Company"}
        </button>
      </div>
    </form>
  );
};

/* ---------------- UI Helpers ---------------- */

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-lg font-medium mb-4 border-b pb-2">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      {...props}
      rows="4"
      className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Spinner = () => (
  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

export default CompanyForm;
