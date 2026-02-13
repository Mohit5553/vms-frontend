import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCompanies, deleteCompany } from "../services/company.api";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    setLoading(true);
    const res = await getCompanies();
    setCompanies(res.data.data);
    console.log("Fetched companies:", res.data.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    await deleteCompany(id);
    fetchCompanies();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Company</h1>
        <Link
          to="/company-add"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Company
        </Link>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Industry</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c._id}>
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.industry}</td>
              <td className="p-2 border space-x-2">
                <Link to={`/companies/${c._id}`} className="text-blue-600">
                  View
                </Link>
                <Link
                  to={`/companies/${c._id}/edit`}
                  className="text-green-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(c._id)}
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
};

export default CompanyList;
