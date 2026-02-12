import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getLocationById } from "../services/location.api";
import LocationForm from "./LocationForm";

export default function LocationEdit() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationById(id).then((res) => setLocation(res.data.data));
  }, [id]);

  if (!location) return <p>Loading...</p>;
  return <LocationForm initialData={location} />;
}
