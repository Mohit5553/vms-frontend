import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getAdvertisementById } from "../services/advertisement.api";
import AdvertisementForm from "./AdvertisementForm";

export default function AdvertisementEdit() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        const res = await getAdvertisementById(id);

        // Normalize deviceId to array (VERY IMPORTANT for your form)
        const data = res.data.data;

        const normalizedAd = {
          ...data,
          deviceId: Array.isArray(data.deviceId)
            ? data.deviceId
            : data.deviceId
              ? [data.deviceId]
              : [],
        };

        setAd(normalizedAd);
      } catch (err) {
        console.error("Error fetching advertisement:", err);
        setError("Failed to load advertisement");
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  if (loading) return <p className="p-6">Loading advertisement...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return <AdvertisementForm initialData={ad} />;
}
