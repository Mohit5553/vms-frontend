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

        const data = res.data.data;

        const normalizedAd = {
          ...data,

          company_ids: data.company_ids?.map(c =>
            typeof c === "string" ? c : c._id
          ) || [],

          location_ids: data.location_ids?.map(l =>
            typeof l === "string" ? l : l._id
          ) || [],

          deviceIds: (data.deviceIds?.length
            ? data.deviceIds
            : data.deviceId || []
          ).map(d => (typeof d === "string" ? d : d.deviceId)),

          startDate: data.startDate?.slice(0, 10),
          endDate: data.endDate?.slice(0, 10),
        };


        console.log("Fetched ad:", normalizedAd);
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
