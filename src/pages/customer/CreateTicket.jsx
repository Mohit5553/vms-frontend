import React, { useEffect, useState } from "react";
import { createTicket, getTickets } from "../../services/ticketService";

export default function SupportDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedSubFamily, setSelectedSubFamily] = useState("");
  const user = JSON.parse(localStorage.getItem("user")); // user object with _id, token, etc.
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    category: "",
    family: "",
    subFamily: "",
    priority: "Low",
    subject: "",
    description: "",
    relatedProductService: "",
  });

  // FETCH TICKETS
  // const fetchTickets = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await getTickets();
  //     setTickets(res.data.data || []);
  //   } catch (err) {
  //     console.error("Fetch tickets error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getTickets();
      console.log("Tickets API response:", res.data);
      setTickets(res.data.data || []); // confirm if 'data' property holds tickets array
    } catch (err) {
      console.error("Fetch tickets error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/categories/list");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
    fetchTickets(); // your existing fetch
  }, []);

  // CREATE TICKET
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTicket(formData);
      fetchTickets();
      setFormData({
        category: "",
        family: "",
        subFamily: "",
        priority: "Low",
        subject: "",
        description: "",
        relatedProductService: "",
      });
      setSelectedCategory("");
      setSelectedFamily("");
      setSelectedSubFamily("");
    } catch (err) {
      console.error("Create ticket error:", err);
    }
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "Open").length,
    progress: tickets.filter((t) => t.status === "In Progress").length,
    resolved: tickets.filter((t) => t.status === "Resolved").length,
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      case "Critical":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <h1 className="text-xl font-semibold mb-6">🎧 Support Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "bg-blue-500" },
          { label: "Open", value: stats.open, color: "bg-yellow-500" },
          {
            label: "In Progress",
            value: stats.progress,
            color: "bg-purple-500",
          },
          { label: "Resolved", value: stats.resolved, color: "bg-green-500" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow">
            <div className={`w-8 h-8 rounded-full ${s.color} mb-2`} />
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label} Tickets</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Create Ticket */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6"
        >
          <h2 className="text-sm font-semibold mb-4">Create Ticket</h2>

          {/* Category dropdown */}
          <select
            name="category"
            value={formData.category}
            onChange={(e) => {
              setFormData({
                ...formData,
                category: e.target.value,
                family: "",
                subFamily: "",
              });
              setSelectedCategory(e.target.value);
              setSelectedFamily("");
              setSelectedSubFamily("");
            }}
            className="w-full mb-3 p-2 border rounded text-sm"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Family dropdown */}
          <select
            name="family"
            value={formData.family}
            onChange={(e) => {
              setFormData({
                ...formData,
                family: e.target.value,
                subFamily: "",
              });
              setSelectedFamily(e.target.value);
              setSelectedSubFamily("");
            }}
            className="w-full mb-3 p-2 border rounded text-sm"
            disabled={!formData.category}
            required
          >
            <option value="">Select Family</option>
            {categories
              .find((c) => c.name === formData.category)
              ?.families.filter((f) => f.isActive)
              .map((family) => (
                <option key={family._id} value={family.name}>
                  {family.name}
                </option>
              ))}
          </select>

          {/* Sub-Family dropdown */}
          <select
            name="subFamily"
            value={formData.subFamily}
            onChange={(e) =>
              setFormData({ ...formData, subFamily: e.target.value })
            }
            className="w-full mb-3 p-2 border rounded text-sm"
            disabled={!formData.family}
            required
          >
            <option value="">Select Sub-Family</option>
            {categories
              .find((c) => c.name === formData.category)
              ?.families.find((f) => f.name === formData.family)
              ?.subFamilies.filter((s) => s.isActive)
              .map((sub) => (
                <option key={sub._id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
          </select>

          <select
            name="priority"
            className="w-full mb-3 p-2 border rounded text-sm"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>

          <input
            name="subject"
            placeholder="Subject"
            className="w-full mb-3 p-2 border rounded text-sm"
            value={formData.subject}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            rows="3"
            className="w-full mb-3 p-2 border rounded text-sm"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            name="relatedProductService"
            placeholder="Related Product / Service"
            className="w-full mb-4 p-2 border rounded text-sm"
            value={formData.relatedProductService}
            onChange={handleChange}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
            Submit Ticket
          </button>
        </form>

        {/* Ticket List */}
        {/* Ticket List */}
        <div className="md:col-span-2 bg-white rounded-xl shadow overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="text-sm font-semibold">Recent Tickets</h2>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-gray-500">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">No tickets found</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-5 py-3">Ticket ID</th>
                  <th className="text-left px-5 py-3">Subject</th>
                  <th className="text-left px-5 py-3">Category</th>
                  <th className="text-left px-5 py-3">Priority</th>
                  <th className="text-left px-5 py-3">Created</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((t) => (
                  <tr
                    key={t._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-3 text-xs font-medium">
                      {t.ticketId}
                    </td>

                    <td className="px-5 py-3">
                      <p className="font-medium">{t.subject}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {t.description}
                      </p>
                    </td>

                    <td className="px-5 py-3 text-xs">{t.category}</td>

                    <td className="px-5 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
                          t.priority
                        )}`}
                      >
                        {t.priority}
                      </span>
                    </td>

                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-3 text-xs">
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {t.status || "Open"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
