import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompanies } from "../services/company.api";
import {
  getLocationsByCompany,
  deleteLocation,
} from "../services/location.api";

export default function LocationList() {
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState("");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getCompanies().then((res) => setCompanies(res.data.data));
  }, []);

  useEffect(() => {
    if (companyId) {
      getLocationsByCompany(companyId).then((res) =>
        setLocations(res.data.data),
      );
    }
  }, [companyId]);

  return (
    <div className="max-w-6xl mx-auto p-6 h-screen">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl">Locations</h2>
        <Link
          to="/locations/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Location
        </Link>
      </div>

      <select
        className="border p-2 mb-4"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
      >
        <option value="">Select Company</option>
        {companies.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Location</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((l) => (
            <tr key={l._id}>
              <td className="p-2 border">{l.name}</td>
              <td className="p-2 border">{l.address?.city}</td>
              <td className="p-2 border space-x-2">
                <Link to={`/locations/${l._id}`} className="text-blue-600">
                  View
                </Link>
                <Link
                  to={`/locations/${l._id}/edit`}
                  className="text-green-600"
                >
                  Edit
                </Link>
                <button
                  onClick={async () => {
                    await deleteLocation(l._id);

                    // refresh list
                    setLocations((prev) => prev.filter((loc) => loc._id !== l._id));
                  }}
                  className="text-red-600"
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
