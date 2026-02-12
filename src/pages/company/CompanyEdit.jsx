import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../services/company.api";
import CompanyForm from "./CompanyForm";

const CompanyEdit = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    getCompanyById(id).then((res) => setCompany(res.data.data));
  }, [id]);

  if (!company) return <p>Loading...</p>;

  return <CompanyForm initialData={company} />;
};

export default CompanyEdit;
