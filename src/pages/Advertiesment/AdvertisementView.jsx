import { useParams, Link } from "react-router-dom";

import React, { useEffect, useState } from "react";
import { getAdvertisementById } from "../services/advertisement.api";

export default function AdvertisementView() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const VIDEO_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    getAdvertisementById(id).then((res) => setAd(res.data.data));
  }, [id]);
  useEffect(() => {
    getAdvertisementById(id).then((res) => {
      console.log("Full API Response:", res);
      console.log("Only ad data:", res.data.data);

      setAd(res.data.data);
    });
  }, [id]);

  if (!ad) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 shadow rounded h-screen">
      <h2 className="text-2xl font-semibold">{ad.title}</h2>
      <p>
        <b>Company:</b> {ad.company_id?.name}
      </p>
      <p>
        <b>Location:</b> {ad.location_id?.name}
      </p>
      <p>
        <b>Device:</b> {ad.deviceId}
      </p>

      <video
        src={`${VIDEO_BASE_URL}${ad.videoPath}`}
        controls
        className="mt-4 w-full"
      />
      <Link
        to={`/advertisements/${id}/edit`}
        className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Edit
      </Link>
    </div>
  );
}
