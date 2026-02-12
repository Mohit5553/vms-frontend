import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCompanyById } from "../services/company.api";

const CompanyView = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    getCompanyById(id).then((res) => setCompany(res.data.data));
  }, [id]);

  if (!company) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded h-screen">
      <h2 className="text-2xl font-semibold mb-4">{company.name}</h2>

      <p>
        <b>Industry:</b> {company.industry}
      </p>
      <p>
        <b>Email:</b> {company.email}
      </p>
      <p>
        <b>Phone:</b> {company.phone}
      </p>
      <p>
        <b>Address:</b> {company.address?.city}, {company.address?.state}
      </p>

      <div className="mt-6">
        <Link
          to={`/companies/${id}/edit`}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Edit Company
        </Link>
      </div>
    </div>
  );
};

export default CompanyView;
