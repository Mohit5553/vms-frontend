import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAdvertisementById } from "../services/advertisement.api";
import { SOCKET_BASE_URL } from "../../config";

export default function AdvertisementView() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    getAdvertisementById(id)
      .then((res) => {
        console.log("Only ad data:", res.data.data);
        setAd(res.data.data);
      })
      .catch((err) => console.error("Fetch ad error:", err));
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
        <b>Device:</b> {Array.isArray(ad.deviceId) ? ad.deviceId.join(", ") : ad.deviceId}
      </p>

      <video
        src={`${SOCKET_BASE_URL}${ad.videoPath}`}
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
